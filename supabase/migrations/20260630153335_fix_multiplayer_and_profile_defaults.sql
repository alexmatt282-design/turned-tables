/*
# Fix multiplayer and profile column defaults

1. Changes
- Add DEFAULT auth.uid() to game_rooms.host_id so room creation works without explicit host_id
- Add DEFAULT auth.uid() to room_players.user_id so joining rooms works without explicit user_id
- Add trigger to auto-create profile on user signup (handles first-time login profile creation)
- Add updated_at trigger to profiles table

2. Security
- No RLS policy changes
- Defaults use auth.uid() which is secure

3. Notes
- The DEFAULT auth.uid() is critical for INSERT policies to work correctly
- Without these defaults, the INSERT policy WITH CHECK (auth.uid() = host_id) fails
  because the frontend may not pass the user_id/host_id explicitly
*/

-- Add DEFAULT auth.uid() to multiplayer tables
ALTER TABLE public.game_rooms 
ALTER COLUMN host_id SET DEFAULT auth.uid();

ALTER TABLE public.room_players 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Add updated_at trigger to profiles
CREATE TRIGGER profiles_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, tokens, xp, display_name, active_skin, unlocked_skins, equipped_badges, clothing, accessory, hair, facial, skin_color, games_played, games_won, compounds_crafted, elements_drafted)
  VALUES (NEW.id, 0, 0, '', 'spectral_cyan', ARRAY['spectral_cyan'], ARRAY[]::text[], 'lab_coat', 'safety_goggles', 'wild_scientist', 'none', 'warm_peach', 0, 0, 0, 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
