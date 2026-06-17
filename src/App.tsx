import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { TurnedTables } from './components/TurnedTables';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const [tokens, setTokens] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // AUTH
  // -----------------------------
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

  // -----------------------------
  // LOAD PROGRESS (TOKENS + XP)
  // -----------------------------
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('tokens, xp')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        await supabase.from('profiles').upsert({
          id: user.id,
          tokens: 0,
          xp: 0,
        });

        setTokens(0);
        setXp(0);
        return;
      }

      setTokens(data.tokens ?? 0);
      setXp(data.xp ?? 0);
    };

    loadUserProgress();
  }, [user]);

  // -----------------------------
  // UPDATE SUPABASE
  // -----------------------------
  const updateProgress = async (newTokens: number, newXp: number) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        tokens: newTokens,
        xp: newXp,
      })
      .eq('id', user.id);
  };

  // -----------------------------
  // GAME ACTIONS
  // -----------------------------
  const handleAddTokens = async (amount: number) => {
    setTokens((prev) => {
      const next = prev + amount;
      updateProgress(next, xp);
      return next;
    });
  };

  const handleAddXP = async (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      updateProgress(tokens, next);
      return next;
    });
  };

  // -----------------------------
  // LEVEL SYSTEM
  // -----------------------------
  const calculateLevel = (xp: number) => {
    if (xp < 100) return 1;
    if (xp < 250) return 2;
    if (xp < 450) return 3;
    if (xp < 700) return 4;
    if (xp < 1000) return 5;

    return Math.floor((xp - 1000) / 500) + 6;
  };

  const level = calculateLevel(xp);

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TurnedTables
      onBack={() => {}}
      onAddStars={handleAddTokens}
      stars={tokens}
      level={level}
      userId={user.id}
    />
  );
}
