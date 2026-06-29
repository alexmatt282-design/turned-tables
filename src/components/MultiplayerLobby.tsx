import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  toggleReady,
  switchTeam,
  startGame,
  sendChatMessage,
  getRoomPlayers,
  subscribeToRoom,
  unsubscribeFromRoom,
  type RoomMode,
  type TeamColor,
  type GameRoom,
  type RoomPlayer,
  type ChatMessage,
} from '../lib/multiplayer';
import {
  motion,
  AnimatePresence,
} from 'motion/react';
import {
  Users,
  Send,
  X,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Swords,
  Shield,
  MessageSquare,
  UserPlus,
  Play,
  ChevronRight,
} from 'lucide-react';
import audio from '../utils/audio';

interface MultiplayerLobbyProps {
  userId: string;
  onGameStart: (roomId: string, mode: RoomMode, players: RoomPlayer[]) => void;
  onBack: () => void;
}

export function MultiplayerLobby({ userId, onGameStart, onBack }: MultiplayerLobbyProps) {
  const [mode, setMode] = useState<RoomMode | null>(null);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const channelRef = useRef<any>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        unsubscribeFromRoom(channelRef.current);
      }
    };
  }, []);

  // Subscribe to room updates
  const subscribeToRoomUpdates = useCallback((roomId: string) => {
    if (channelRef.current) {
      unsubscribeFromRoom(channelRef.current);
    }

    channelRef.current = subscribeToRoom(roomId, {
      onPlayerJoin: async (player) => {
        audio.playPop();
        // Fetch email for the new player
        const { data: profile } = await supabase
          .from('profiles')
          .select('tokens, xp')
          .eq('id', player.user_id)
          .single();
        setPlayers(prev => [...prev.filter(p => p.user_id !== player.user_id), { ...player, profile }]);
      },
      onPlayerLeave: (playerUserId) => {
        setPlayers(prev => prev.filter(p => p.user_id !== playerUserId));
      },
      onPlayerReady: (player) => {
        setPlayers(prev => prev.map(p => p.user_id === player.user_id ? { ...p, is_ready: player.is_ready } : p));
      },
      onGameStart: () => {
        audio.playGrandCheer();
        if (room) {
          onGameStart(room.id, room.mode, players);
        }
      },
      onChatMessage: async (msg) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .eq('id', msg.user_id)
          .single();

        setChatMessages(prev => [...prev.slice(-49), { ...msg, sender_email: profile ? '' : undefined }]);
        audio.playPop();
      },
    });
  }, [room, players, onGameStart]);

  // Load players when room changes
  useEffect(() => {
    if (room) {
      getRoomPlayers(room.id).then(async (ps) => {
        const enriched = await Promise.all(ps.map(async (p) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('tokens, xp')
            .eq('id', p.user_id)
            .single();
          return { ...p, profile };
        }));
        setPlayers(enriched);
      });
      subscribeToRoomUpdates(room.id);
    }
  }, [room?.id]);

  const handleCreateRoom = async (selectedMode: RoomMode) => {
    setIsCreating(true);
    setError('');
    const newRoom = await createRoom(selectedMode, userId);
    if (newRoom) {
      setRoom(newRoom);
      setMode(selectedMode);
      // Join own room
      const result = await joinRoom(newRoom.code, userId, 'cyan');
      if (result) {
        audio.playSuccess();
      }
    } else {
      setError('Failed to create room. Please try again.');
    }
    setIsCreating(false);
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    setError('');
    const result = await joinRoom(joinCode.trim(), userId);
    if (result) {
      setRoom(result.room);
      setMode(result.room.mode);
      audio.playSuccess();
    } else {
      setError('Room not found or is full. Check the code and try again.');
    }
    setIsJoining(false);
  };

  const handleLeave = async () => {
    if (room) {
      await leaveRoom(room.id, userId);
    }
    if (channelRef.current) {
      unsubscribeFromRoom(channelRef.current);
      channelRef.current = null;
    }
    setRoom(null);
    setPlayers([]);
    setChatMessages([]);
    setMode(null);
    setUserReady(false);
    setError('');
  };

  const handleToggleReady = async () => {
    if (!room) return;
    const newReady = !userReady;
    const success = await toggleReady(room.id, userId, newReady);
    if (success) {
      setUserReady(newReady);
      audio.playPop();
      setPlayers(prev => prev.map(p => p.user_id === userId ? { ...p, is_ready: newReady } : p));
    }
  };

  const handleSwitchTeam = async (team: TeamColor) => {
    if (!room) return;
    const success = await switchTeam(room.id, userId, team);
    if (success) {
      audio.playPop();
      setPlayers(prev => prev.map(p => p.user_id === userId ? { ...p, team } : p));
    }
  };

  const handleSendChat = async () => {
    if (!room || !chatInput.trim()) return;
    const success = await sendChatMessage(room.id, userId, chatInput.trim());
    if (success) {
      setChatInput('');
    }
  };

  const handleStartGame = async () => {
    if (!room) return;
    const success = await startGame(room.id, room.host_id);
    if (success) {
      audio.playGrandCheer();
      onGameStart(room.id, room.mode, players);
    }
  };

  const copyRoomCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isHost = room?.host_id === userId;
  const allReady = players.length >= (mode === '1v1' ? 2 : 2) && players.every(p => p.is_ready);
  const cyanPlayers = players.filter(p => p.team === 'cyan');
  const amberPlayers = players.filter(p => p.team === 'amber');
  const maxPerTeam = mode === '3v3' ? 3 : 1;

  const getPlayerName = (p: RoomPlayer) => {
    return p.user_id === userId ? 'You' : `Explorer ${p.user_id.slice(0, 4)}`;
  };

  // Mode selection screen
  if (!room) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center p-6"
      >
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white mb-2">Multiplayer Arena</h2>
            <p className="text-slate-400 text-sm">Challenge chemists in real-time battles</p>
          </div>

          {/* Create Room */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create a Room</p>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCreateRoom('1v1')}
                disabled={isCreating}
                className="p-5 bg-gradient-to-b from-cyan-950/80 to-cyan-900/40 border-2 border-cyan-500/30 rounded-2xl text-left cursor-pointer disabled:opacity-50 hover:border-cyan-400/50 transition-all group"
              >
                <Swords className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-white text-sm block">1v1 Duel</span>
                <span className="text-[10px] text-cyan-300/70 uppercase tracking-wider">Head-to-head PvP</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCreateRoom('3v3')}
                disabled={isCreating}
                className="p-5 bg-gradient-to-b from-amber-950/80 to-amber-900/40 border-2 border-amber-500/30 rounded-2xl text-left cursor-pointer disabled:opacity-50 hover:border-amber-400/50 transition-all group"
              >
                <Shield className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-white text-sm block">3v3 Team</span>
                <span className="text-[10px] text-amber-300/70 uppercase tracking-wider">Co-op team battle</span>
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 font-bold">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Join Room */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Join a Room</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ENTER ROOM CODE"
                maxLength={6}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 text-sm font-mono tracking-[0.3em] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinRoom}
                disabled={isJoining || !joinCode.trim()}
                className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isJoining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Join
              </motion.button>
            </div>
          </div>

          {error && (
            <div className="text-center text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              {error}
            </div>
          )}

          {/* Back button */}
          <button
            onClick={onBack}
            className="w-full py-3 text-slate-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Back to Setup
          </button>
        </div>
      </motion.div>
    );
  }

  // Room lobby screen
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex flex-col p-6 max-w-4xl mx-auto"
    >
      {/* Room Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            {mode === '3v3' ? <Shield className="w-5 h-5 text-amber-400" /> : <Swords className="w-5 h-5 text-cyan-400" />}
            {mode === '3v3' ? '3v3 Team Battle' : '1v1 Duel'} Lobby
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-400 text-xs">Room Code:</span>
            <span className="font-mono font-black text-cyan-400 text-lg tracking-[0.2em]">{room.code}</span>
            <button
              onClick={copyRoomCode}
              className="p-1 px-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-300 hover:text-white hover:border-cyan-500 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <button
          onClick={handleLeave}
          className="p-2 px-4 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500/25 transition-all cursor-pointer"
        >
          Leave Room
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Cyan Team */}
        <div className="bg-cyan-950/30 border-2 border-cyan-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Team Cyan</span>
            <span className="text-[10px] text-cyan-300/60 font-bold">{cyanPlayers.length}/{maxPerTeam}</span>
          </div>
          <div className="space-y-2">
            {cyanPlayers.map((p) => (
              <div key={p.user_id} className="flex items-center justify-between p-2.5 bg-cyan-900/30 border border-cyan-800/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-xs font-black text-cyan-300">
                    {getPlayerName(p).charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-cyan-100">{getPlayerName(p)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {p.is_ready && (
                    <span className="text-[9px] font-black text-green-400 uppercase bg-green-500/10 px-1.5 py-0.5 rounded">Ready</span>
                  )}
                  {p.user_id === userId && p.team === 'cyan' && mode === '3v3' && (
                    <button
                      onClick={() => handleSwitchTeam('amber')}
                      className="text-[9px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            ))}
            {Array.from({ length: maxPerTeam - cyanPlayers.length }).map((_, i) => (
              <div key={`cyan-empty-${i}`} className="flex items-center justify-center p-2.5 bg-slate-900/20 border border-dashed border-slate-700/50 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold animate-pulse flex items-center gap-1">
                  <UserPlus className="w-3 h-3" />
                  Waiting...
                </span>
              </div>
            ))}
            {userId !== room.host_id && !cyanPlayers.find(p => p.user_id === userId) && cyanPlayers.length < maxPerTeam && (
              <button
                onClick={() => handleSwitchTeam('cyan')}
                className="w-full py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl hover:bg-cyan-500/20 transition-all cursor-pointer"
              >
                Join Cyan
              </button>
            )}
          </div>
        </div>

        {/* Amber Team */}
        <div className="bg-amber-950/30 border-2 border-amber-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Team Amber</span>
            <span className="text-[10px] text-amber-300/60 font-bold">{amberPlayers.length}/{maxPerTeam}</span>
          </div>
          <div className="space-y-2">
            {amberPlayers.map((p) => (
              <div key={p.user_id} className="flex items-center justify-between p-2.5 bg-amber-900/30 border border-amber-800/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-xs font-black text-amber-300">
                    {getPlayerName(p).charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-amber-100">{getPlayerName(p)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {p.is_ready && (
                    <span className="text-[9px] font-black text-green-400 uppercase bg-green-500/10 px-1.5 py-0.5 rounded">Ready</span>
                  )}
                  {p.user_id === userId && p.team === 'amber' && mode === '3v3' && (
                    <button
                      onClick={() => handleSwitchTeam('cyan')}
                      className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            ))}
            {Array.from({ length: maxPerTeam - amberPlayers.length }).map((_, i) => (
              <div key={`amber-empty-${i}`} className="flex items-center justify-center p-2.5 bg-slate-900/20 border border-dashed border-slate-700/50 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold animate-pulse flex items-center gap-1">
                  <UserPlus className="w-3 h-3" />
                  Waiting...
                </span>
              </div>
            ))}
            {userId !== room.host_id && !amberPlayers.find(p => p.user_id === userId) && amberPlayers.length < maxPerTeam && (
              <button
                onClick={() => handleSwitchTeam('amber')}
                className="w-full py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                Join Amber
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat (3v3 only) */}
      {mode === '3v3' && (
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Team Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" />
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1.5 mb-3 custom-scrollbar">
            {chatMessages.length === 0 && (
              <p className="text-[10px] text-slate-500 italic">No messages yet. Coordinate your strategy!</p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={msg.id || i} className="text-xs text-slate-300">
                <span className="font-bold text-cyan-400">{msg.user_id === userId ? 'You' : `Explorer ${msg.user_id.slice(0, 4)}`}:</span>{' '}
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Type team tactics..."
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 text-xs text-white rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleReady}
          className={`flex-1 w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
            userReady
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
        >
          {userReady ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {userReady ? 'Ready!' : 'Toggle Ready'}
        </motion.button>

        {isHost && (
          <motion.button
            whileHover={{ scale: allReady ? 1.03 : 1 }}
            whileTap={{ scale: allReady ? 0.97 : 1 }}
            onClick={handleStartGame}
            disabled={!allReady}
            className={`flex-1 w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
              allReady
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white cursor-pointer shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {allReady ? (
              <>
                <ChevronRight className="w-4 h-4" />
                START BATTLE
              </>
            ) : (
              'Waiting for all players...'
            )}
          </motion.button>
        )}
      </div>

      {error && (
        <div className="mt-4 text-center text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
          {error}
        </div>
      )}
    </motion.div>
  );
}
