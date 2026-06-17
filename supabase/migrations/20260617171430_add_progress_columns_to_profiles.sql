-- Add columns for full user progress persistence
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS active_skin text DEFAULT 'spectral_cyan';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlocked_skins text[] DEFAULT ARRAY['spectral_cyan']::text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS equipped_badges text[] DEFAULT ARRAY[]::text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clothing text DEFAULT 'lab_coat';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accessory text DEFAULT 'safety_goggles';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hair text DEFAULT 'wild_scientist';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facial text DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skin_color text DEFAULT 'warm_peach';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS games_played integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS games_won integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS compounds_crafted integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS elements_drafted integer DEFAULT 0;