/*
# Add leaderboard function and RLS for public profile viewing

1. Create a function to get leaderboard rankings
2. Allow authenticated users to view all profiles for leaderboard
*/

-- Update RLS policy to allow authenticated users to view all profiles (for leaderboard)
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

-- Create a function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INT)
RETURNS INT AS $$
BEGIN
  IF xp < 100 THEN RETURN 1;
  ELSIF xp < 250 THEN RETURN 2;
  ELSIF xp < 450 THEN RETURN 3;
  ELSIF xp < 700 THEN RETURN 4;
  ELSIF xp < 1000 THEN RETURN 5;
  ELSE RETURN (FLOOR((xp - 1000) / 500) + 6)::INT;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a view for the leaderboard
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  id,
  display_name,
  xp,
  calculate_level(xp) as level,
  games_played,
  games_won,
  games_won::FLOAT / NULLIF(games_played, 0) * 100 as win_rate,
  equipped_badges,
  active_skin,
  created_at
FROM profiles
WHERE display_name IS NOT NULL AND display_name != ''
ORDER BY xp DESC, games_won DESC, created_at ASC;
