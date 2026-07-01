import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { TurnedTables } from './components/TurnedTables';
import { LoginScreen } from './components/LoginScreen';

export interface UserProfile {
  tokens: number;
  xp: number;
  display_name: string;
  active_skin: string;
  unlocked_skins: string[];
  equipped_badges: string[];
  clothing: string;
  accessory: string;
  hair: string;
  facial: string;
  skin_color: string;
  games_played: number;
  games_won: number;
  compounds_crafted: number;
  elements_drafted: number;
  monthly_challenge_key?: string | null;
  monthly_challenge_completed_at?: string | null;
  weekly_challenge_key?: string | null;
  weekly_challenge_completed_at?: string | null;
  daily_challenge_key?: string | null;
  daily_challenge_completed_at?: string | null;
  last_seen?: string | null;
}

// Challenge key generators - these create unique identifiers for each period
export function getMonthlyChallengeKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getWeeklyChallengeKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.floor((days + startOfYear.getDay() + 6) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

export function getDailyChallengeKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isChallengeCompleted(
  profile: UserProfile | undefined,
  challengeType: 'monthly' | 'weekly' | 'daily',
  currentKey: string
): boolean {
  if (!profile) return false;

  const keyField = `${challengeType}_challenge_key` as keyof UserProfile;
  const completedField = `${challengeType}_challenge_completed_at` as keyof UserProfile;

  const savedKey = profile[keyField];
  const completedAt = profile[completedField];

  // If the key matches and there's a completion timestamp, it's completed
  return savedKey === currentKey && !!completedAt;
}

const PREFIXES = [
  "Quantum", "Alkali", "Atomic", "Valence", "Kinetic", "Isotopic",
  "Neutron", "Molecular", "Catalytic", "Gaseous", "Ionic", "Halogen",
  "Thermal", "Covalent", "Subatomic", "Spectral", "Reactive", "Magnetic",
  "Periodic", "Organic", "Luminescent", "Aerobic", "Synthesized", "Metallic", "Anhydrous"
];

const SUFFIXES = [
  "Alchemist", "Catalyst", "Reactor", "Proton", "Electron", "Isotope",
  "Molecule", "Polymer", "Titanium", "Silicon", "Radical", "Spectra",
  "Vanguard", "Pioneer", "Crucible", "Fission", "Fusion", "Entropy",
  "Synthesizer", "Anion", "Cation", "Chamber", "Element", "Noble"
];

function generateRandomName(): string {
  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  return `${p} ${s}`;
}

async function generateUniqueName(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const name = generateRandomName();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('display_name', name)
      .maybeSingle();

    if (error) {
      console.error('Error checking name uniqueness:', error);
      // Fall back to generating a name with a random suffix
      return `${generateRandomName()}${Math.floor(Math.random() * 1000)}`;
    }

    if (!data) {
      return name;
    }

    attempts++;
  }

  // If we couldn't find a unique name after many attempts, add a random number
  return `${generateRandomName()}${Math.floor(Math.random() * 10000)}`;
}

const DEFAULT_PROFILE: UserProfile = {
  tokens: 0,
  xp: 0,
  display_name: '',
  active_skin: 'spectral_cyan',
  unlocked_skins: ['spectral_cyan'],
  equipped_badges: [],
  clothing: 'lab_coat',
  accessory: 'safety_goggles',
  hair: 'wild_scientist',
  facial: 'none',
  skin_color: 'warm_peach',
  games_played: 0,
  games_won: 0,
  compounds_crafted: 0,
  elements_drafted: 0,
  monthly_challenge_key: null,
  monthly_challenge_completed_at: null,
  weekly_challenge_key: null,
  weekly_challenge_completed_at: null,
  daily_challenge_key: null,
  daily_challenge_completed_at: null,
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      if (!data.session?.user) {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileLoaded(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setProfile({ ...DEFAULT_PROFILE });
        setProfileLoaded(true);
        setLoading(false);
        return;
      }

      if (!data) {
        // Profile doesn't exist yet, create it with a unique random name
        const uniqueName = await generateUniqueName();
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          ...DEFAULT_PROFILE,
          display_name: uniqueName,
          last_seen: new Date().toISOString(),
        });
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        setProfile({ ...DEFAULT_PROFILE, display_name: uniqueName });
        setProfileLoaded(true);
        setLoading(false);
        return;
      }

      // Update last_seen to mark user as online
      await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', user.id);

      setProfile({
        tokens: data.tokens ?? 0,
        xp: data.xp ?? 0,
        display_name: data.display_name ?? '',
        active_skin: data.active_skin ?? 'spectral_cyan',
        unlocked_skins: data.unlocked_skins ?? ['spectral_cyan'],
        equipped_badges: data.equipped_badges ?? [],
        clothing: data.clothing ?? 'lab_coat',
        accessory: data.accessory ?? 'safety_goggles',
        hair: data.hair ?? 'wild_scientist',
        facial: data.facial ?? 'none',
        skin_color: data.skin_color ?? 'warm_peach',
        games_played: data.games_played ?? 0,
        games_won: data.games_won ?? 0,
        compounds_crafted: data.compounds_crafted ?? 0,
        elements_drafted: data.elements_drafted ?? 0,
        monthly_challenge_key: data.monthly_challenge_key ?? null,
        monthly_challenge_completed_at: data.monthly_challenge_completed_at ?? null,
        weekly_challenge_key: data.weekly_challenge_key ?? null,
        weekly_challenge_completed_at: data.weekly_challenge_completed_at ?? null,
        daily_challenge_key: data.daily_challenge_key ?? null,
        daily_challenge_completed_at: data.daily_challenge_completed_at ?? null,
        last_seen: data.last_seen ?? null,
      });
      setProfileLoaded(true);
      setLoading(false);
    };

    loadProfile();

    // Set up interval to update last_seen every 2 minutes while active
    const lastSeenInterval = setInterval(async () => {
      if (user) {
        await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', user.id);
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(lastSeenInterval);
  }, [user]);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const next = { ...profile, ...updates };
    setProfile(next);

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error saving profile:', error);
    }
  }, [user, profile]);

  const level = (() => {
    const xp = profile.xp;
    if (xp < 100) return 1;
    if (xp < 250) return 2;
    if (xp < 450) return 3;
    if (xp < 700) return 4;
    if (xp < 1000) return 5;
    return Math.floor((xp - 1000) / 500) + 6;
  })();

  if (loading || !profileLoaded) {
    return (
      <div className="min-h-screen bg-[#070c15] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Loading Academy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TurnedTables
      onBack={() => {}}
      onAddStars={(amount: number) => saveProfile({ tokens: profile.tokens + amount })}
      stars={profile.tokens}
      level={level}
      userId={user.id}
      userEmail={user.email}
      profile={profile}
      onSaveProfile={saveProfile}
    />
  );
}
