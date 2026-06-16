import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { TurnedTables } from './components/TurnedTables';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  const [stars, setStars] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load stars from Supabase when user logs in
  useEffect(() => {
    const loadStars = async () => {
      if (!user) return;

      let { data, error } = await supabase
        .from('profiles')
        .select('stars')
        .eq('id', user.id)
        .single();

      // If no profile exists, create it
      if (error || !data) {
        await supabase.from('profiles').insert({
          id: user.id,
          stars: 0,
        });

        setStars(0);
        return;
      }

      setStars(data.stars || 0);
    };

    loadStars();
  }, [user]);

  // Save stars to Supabase
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

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <LoginScreen />;

  return (
    <TurnedTables
      onBack={() => {}}
      onAddStars={handleAddStars}
      stars={stars}
    />
  );
}