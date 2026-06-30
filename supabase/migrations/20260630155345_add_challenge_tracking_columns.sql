/*
# Add challenge tracking columns to profiles

1. New Columns
- `monthly_challenge_key` (text) - Current month's challenge identifier
- `monthly_challenge_completed_at` (timestamptz) - When monthly was completed
- `weekly_challenge_key` (text) - Current week's challenge identifier  
- `weekly_challenge_completed_at` (timestamptz) - When weekly was completed
- `daily_challenge_key` (text) - Current day's challenge identifier
- `daily_challenge_completed_at` (timestamptz) - When daily was completed

2. Notes
- Keys are date-based strings like "2024-01" for monthly, "2024-W01" for weekly, "2024-01-15" for daily
- NULL completion timestamp means not yet completed for that period
- When the key changes (new period), the challenge automatically refreshes
*/

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS monthly_challenge_key text,
ADD COLUMN IF NOT EXISTS monthly_challenge_completed_at timestamptz,
ADD COLUMN IF NOT EXISTS weekly_challenge_key text,
ADD COLUMN IF NOT EXISTS weekly_challenge_completed_at timestamptz,
ADD COLUMN IF NOT EXISTS daily_challenge_key text,
ADD COLUMN IF NOT EXISTS daily_challenge_completed_at timestamptz;
