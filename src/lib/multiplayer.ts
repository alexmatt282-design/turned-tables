import { supabase } from './supabase';

export type RoomMode = '1v1' | '3v3';
export type RoomStatus = 'waiting' | 'ready' | 'in_progress' | 'completed';
export type TeamColor = 'cyan' | 'amber';

export interface GameRoom {
  id: string;
  code: string;
  mode: RoomMode;
  status: RoomStatus;
  host_id: string;
  max_players: number;
  created_at: string;
  updated_at: string;
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  team: TeamColor;
  is_ready: boolean;
  joined_at: string;
  profile?: { email: string; tokens: number; xp: number } | null;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
  sender_email?: string;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom(mode: RoomMode, hostId: string): Promise<GameRoom | null> {
  const code = generateRoomCode();
  const maxPlayers = mode === '1v1' ? 2 : 6;

  const { data, error } = await supabase
    .from('game_rooms')
    .insert({ code, mode, host_id: hostId, max_players: maxPlayers })
    .select()
    .maybeSingle();

  if (error) {
    console.error('createRoom error:', error);
    return null;
  }
  return data;
}

export async function joinRoom(code: string, userId: string, preferredTeam?: TeamColor): Promise<{ room: GameRoom; player: RoomPlayer } | null> {
  // Find the room
  const { data: room, error: roomError } = await supabase
    .from('game_rooms')
    .select()
    .eq('code', code.toUpperCase())
    .eq('status', 'waiting')
    .maybeSingle();

  if (roomError) {
    console.error('joinRoom: error finding room', roomError);
    return null;
  }

  if (!room) {
    console.error('joinRoom: room not found with code', code);
    return null;
  }

  // Check if already in room
  const { data: existing } = await supabase
    .from('room_players')
    .select()
    .eq('room_id', room.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    return { room, player: existing };
  }

  // Count current players per team
  const { data: players } = await supabase
    .from('room_players')
    .select('team')
    .eq('room_id', room.id);

  if (!players || players.length >= room.max_players) {
    console.error('joinRoom: room full');
    return null;
  }

  // Auto-assign team to balance
  let team: TeamColor = preferredTeam || 'cyan';
  if (!preferredTeam) {
    const cyanCount = players.filter(p => p.team === 'cyan').length;
    const amberCount = players.filter(p => p.team === 'amber').length;
    team = cyanCount <= amberCount ? 'cyan' : 'amber';
  }

  const { data: player, error: playerError } = await supabase
    .from('room_players')
    .insert({ room_id: room.id, user_id: userId, team })
    .select()
    .maybeSingle();

  if (playerError) {
    console.error('joinRoom insert error:', playerError);
    return null;
  }

  if (!player) {
    console.error('joinRoom: player insert returned no data');
    return null;
  }

  return { room, player };
}

export async function leaveRoom(roomId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('room_players')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) {
    console.error('leaveRoom error:', error);
    return false;
  }

  // Check if room is now empty and clean up
  const { data: remaining } = await supabase
    .from('room_players')
    .select('user_id')
    .eq('room_id', roomId);

  if (!remaining || remaining.length === 0) {
    await supabase.from('game_rooms').delete().eq('id', roomId);
  }

  return true;
}

export async function toggleReady(roomId: string, userId: string, ready: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('room_players')
    .update({ is_ready: ready })
    .eq('room_id', roomId)
    .eq('user_id', userId);

  return !error;
}

export async function switchTeam(roomId: string, userId: string, team: TeamColor): Promise<boolean> {
  const { error } = await supabase
    .from('room_players')
    .update({ team })
    .eq('room_id', roomId)
    .eq('user_id', userId);

  return !error;
}

export async function startGame(roomId: string, hostId: string): Promise<boolean> {
  // Verify all players are ready
  const { data: players } = await supabase
    .from('room_players')
    .select('is_ready')
    .eq('room_id', roomId);

  if (!players || players.some(p => !p.is_ready)) {
    return false;
  }

  const { error } = await supabase
    .from('game_rooms')
    .update({ status: 'in_progress' })
    .eq('id', roomId)
    .eq('host_id', hostId);

  return !error;
}

export async function endGame(roomId: string, hostId: string): Promise<boolean> {
  const { error } = await supabase
    .from('game_rooms')
    .update({ status: 'completed' })
    .eq('id', roomId)
    .eq('host_id', hostId);

  return !error;
}

export async function sendChatMessage(roomId: string, userId: string, message: string): Promise<boolean> {
  if (!message.trim()) return false;

  const { error } = await supabase
    .from('room_chat')
    .insert({ room_id: roomId, user_id: userId, message: message.trim() });

  return !error;
}

export async function getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
  const { data, error } = await supabase
    .from('room_players')
    .select()
    .eq('room_id', roomId);

  if (error || !data) return [];
  return data;
}

// Realtime subscriptions
export function subscribeToRoom(roomId: string, callbacks: {
  onPlayerJoin?: (player: RoomPlayer) => void;
  onPlayerLeave?: (playerId: string) => void;
  onPlayerReady?: (player: RoomPlayer) => void;
  onGameStart?: () => void;
  onChatMessage?: (msg: ChatMessage) => void;
}) {
  const channel = supabase.channel(`room:${roomId}`);

  channel
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onPlayerJoin?.(payload.new as RoomPlayer)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => {
        const player = payload.new as RoomPlayer;
        if (player.is_ready) {
          callbacks.onPlayerReady?.(player);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onPlayerLeave?.((payload.old as any).user_id)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
      (payload) => {
        const room = payload.new as GameRoom;
        if (room.status === 'in_progress') {
          callbacks.onGameStart?.();
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'room_chat', filter: `room_id=eq.${roomId}` },
      (payload) => callbacks.onChatMessage?.(payload.new as ChatMessage)
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromRoom(channel: any) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
