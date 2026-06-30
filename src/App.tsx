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
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
        return;
      }

      if (!data) {
        // Profile doesn't exist yet, create it
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          ...DEFAULT_PROFILE,
        });
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        setProfile({ ...DEFAULT_PROFILE });
        return;
      }

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
      });
    };

    loadProfile();
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

  if (loading) {
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
      profile={profile}
      onSaveProfile={saveProfile}
    />
  );
}
