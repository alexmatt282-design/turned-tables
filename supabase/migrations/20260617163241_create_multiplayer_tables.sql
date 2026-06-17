-- Game rooms for multiplayer matchmaking
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- 6-char room code for sharing
  mode TEXT NOT NULL CHECK (mode IN ('1v1', '3v3')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'ready', 'in_progress', 'completed')),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_players INT NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Players in a room
CREATE TABLE IF NOT EXISTS room_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team TEXT NOT NULL DEFAULT 'cyan' CHECK (team IN ('cyan', 'amber')),
  is_ready BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Chat messages for team coordination
CREATE TABLE IF NOT EXISTS room_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_chat ENABLE ROW LEVEL SECURITY;

-- game_rooms policies
CREATE POLICY "select_game_rooms" ON game_rooms FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_game_rooms" ON game_rooms FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = host_id);

CREATE POLICY "update_game_rooms" ON game_rooms FOR UPDATE
  TO authenticated USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);

CREATE POLICY "delete_game_rooms" ON game_rooms FOR DELETE
  TO authenticated USING (auth.uid() = host_id);

-- room_players policies
CREATE POLICY "select_room_players" ON room_players FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_room_players" ON room_players FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_room_players" ON room_players FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_room_players" ON room_players FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- room_chat policies
CREATE POLICY "select_room_chat" ON room_chat FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_room_chat" ON room_chat FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_room_chat" ON room_chat FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for fast lookups
CREATE INDEX idx_game_rooms_code ON game_rooms(code);
CREATE INDEX idx_game_rooms_status ON game_rooms(status);
CREATE INDEX idx_room_players_room ON room_players(room_id);
CREATE INDEX idx_room_players_user ON room_players(user_id);
CREATE INDEX idx_room_chat_room ON room_chat(room_id);
CREATE INDEX idx_room_chat_created ON room_chat(created_at);
