import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { TurnedTables } from './components/TurnedTables';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const [stars, setStars] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // AUTH INIT
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
  // LOAD STARS (SAFE VERSION)
  // -----------------------------
  useEffect(() => {
    const loadStars = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('stars')
        .eq('id', user.id)
        .maybeSingle(); // safer than .single()

      // If row doesn't exist, create it
      if (error || !data) {
        await supabase.from('profiles').upsert({
          id: user.id,
          stars: 0,
        });

        setStars(0);
        return;
      }

      setStars(data.stars ?? 0);
    };

    loadStars();
  }, [user]);

  // -----------------------------
  // UPDATE STARS
  // -----------------------------
  const handleAddStars = async (amount: number) => {
    if (!user) return;

    setStars((prev) => {
      const next = prev + amount;

      supabase
        .from('profiles')
        .update({ stars: next })
        .eq('id', user.id)
        .then();

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
