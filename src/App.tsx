import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { TurnedTables } from './components/TurnedTables';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const [stars, setStars] = useState<number>(0);
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
  // LOAD USER PROGRESS (STARS + XP)
  // -----------------------------
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('stars, xp')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (error || !data) {
        await supabase.from('profiles').upsert({
          id: user.id,
          stars: 0,
          xp: 0,
        });

        setStars(0);
        setXp(0);
        return;
      }

      setStars(data.stars ?? 0);
      setXp(data.xp ?? 0);
    };

    loadUserProgress();
  }, [user]);

  // -----------------------------
  // UPDATE PROGRESS
  // -----------------------------
  const updateProgress = async (newStars: number, newXp: number) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        stars: newStars,
        xp: newXp,
      })
      .eq('id', user.id);
  };

  // -----------------------------
  // ADD STARS (GAME ACTION)
  // -----------------------------
  const handleAddStars = async (amount: number) => {
    setStars((prev) => {
      const next = prev + amount;
      updateProgress(next, xp);
      return next;
    });
  };

  // -----------------------------
  // ADD XP (GAME ACTION)
  // -----------------------------
  const handleAddXP = async (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      updateProgress(stars, next);
      return next;
    });
  };

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
      onAddStars={handleAddStars}
      stars={stars}
    />
  );
}
