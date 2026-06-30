/*
# Enable full replica identity for realtime DELETE events

1. Changes
- Set REPLICA IDENTITY FULL on game_rooms, room_players, and room_chat tables
- This ensures the old row data is available in DELETE realtime events

2. Why
- By default, PostgreSQL only logs the primary key for DELETE events
- With REPLICA IDENTITY FULL, the entire old row is logged
- This allows realtime subscribers to receive the deleted row's data
- Essential for onPlayerLeave callback to work correctly

3. Notes
- This has a small performance overhead but is necessary for realtime DELETE events
*/

ALTER TABLE public.game_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_players REPLICA IDENTITY FULL;
ALTER TABLE public.room_chat REPLICA IDENTITY FULL;
