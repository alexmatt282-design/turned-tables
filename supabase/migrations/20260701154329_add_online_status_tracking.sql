/*
# Add online status tracking to profiles

1. Add last_seen timestamp to track user activity
2. Add trigger to update last_seen on auth activity
3. Create function to check if user is online (active within last 5 minutes)
*/

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT now();

-- Create index for faster online status queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON public.profiles(last_seen DESC);

-- Function to update last_seen timestamp
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET last_seen = now() 
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function that can be called to get online status
CREATE OR REPLACE FUNCTION is_user_online(last_seen_time TIMESTAMPTZ)
RETURNS boolean AS $$
BEGIN
  RETURN last_seen_time IS NOT NULL AND (now() - last_seen_time) < interval '5 minutes';
END;
$$ LANGUAGE plpgsql IMMUTABLE;
