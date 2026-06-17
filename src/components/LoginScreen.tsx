import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Sparkles,
  Trophy,
  BookOpen,
  Shield,
  Send
} from 'lucide-react';
export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://turned-tables.vercel.app',
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('📨 Check your email for your Academy access link.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (

<div className="relative w-full max-w-5xl">
  <div className="text-center mb-10">
    <div className="flex justify-center mb-4">
      <div className="animate-pulse rounded-full bg-cyan-500/20 p-6">
        <Sparkles className="w-12 h-12 text-cyan-400" />
      </div>
    </div>

    <h1 className="text-5xl font-bold tracking-wide">
      TURNED TABLES
    </h1>

    <p className="text-cyan-300 text-xl mt-2">
      Explorer Academy Portal
    </p>

    <p className="text-slate-400 mt-4 max-w-xl mx-auto">
      Continue your scientific journey, unlock new discoveries,
      earn XP, collect badges, and build your legacy within
      the Academy.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="font-semibold">Monthly Challenge</h2>
      </div>

      <p className="text-slate-300 text-sm">
        Dr. Quark has developed a new strategy.
        Defeat him this month for bonus XP and
        exclusive rewards.
      </p>
    </div>

    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h2 className="font-semibold">Academy News</h2>
      </div>

      <ul className="text-slate-300 text-sm space-y-2">
        <li>• Account progression is now online.</li>
        <li>• XP synchronization arriving soon.</li>
        <li>• New cosmetics under development.</li>
      </ul>
    </div>

    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h2 className="font-semibold">Explorer Account</h2>
      </div>

      <p className="text-slate-300 text-sm">
        Your progress, badges, skins, XP, and
        future rewards are tied to your Academy
        account.
      </p>
    </div>
  </div>

  <div className="mt-8 bg-slate-900/80 border border-cyan-900 rounded-2xl p-6 max-w-lg mx-auto">
    <form onSubmit={handleLogin}>
      <label className="block text-sm text-slate-400 mb-2">
        Researcher Email Address
      </label>

      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 transition rounded-xl py-3 font-semibold"
      >
        <Send className="w-4 h-4" />
        {loading
          ? 'Sending Academy Link...'
          : 'Enter Explorer Academy'}
      </button>
    </form>

    {message && (
      <div className="mt-4 text-center text-cyan-300 text-sm">
        {message}
      </div>
    )}
  </div>
</div>
        <h1
          style={{
            margin: 0,
            fontSize: 36,
            letterSpacing: 2,
          }}
        >
          TURNED TABLES
        </h1>

        <h2
          style={{
            marginTop: 10,
            color: '#7dd3fc',
            fontWeight: 400,
          }}
        >
          Explorer Academy Portal
        </h2>

        <p
          style={{
            marginTop: 20,
            lineHeight: 1.6,
            color: '#cbd5e1',
          }}
        >
          Continue your scientific journey.
          <br />
          Track your discoveries, XP, badges,
          skins, and future achievements.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Researcher Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 14,
              marginTop: 20,
              borderRadius: 10,
              border: '1px solid #334155',
              background: '#0f172a',
              color: 'white',
              fontSize: 16,
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 15,
              padding: 14,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 'bold',
              background:
                'linear-gradient(90deg, #06b6d4, #3b82f6)',
              color: 'white',
            }}
          >
            {loading
              ? 'Establishing Connection...'
              : 'Enter Explorer Academy'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            marginTop: 25,
            fontSize: 12,
            color: '#64748b',
          }}
        >
          Secure magic-link authentication powered by Explorer Academy Systems
        </div>
      </div>
    </div>
  );
}
