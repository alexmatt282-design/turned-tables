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



  {/* Background Glow Effects */}
  <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
  <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

  <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

    {/* Logo */}
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <div className="animate-pulse rounded-full bg-cyan-500/10 p-8 border border-cyan-400/20 shadow-[0_0_60px_rgba(34,211,238,0.35)]">
          <Sparkles className="w-12 h-12 text-cyan-400" />
        </div>
      </div>

      <h1 className="text-6xl md:text-7xl font-black tracking-[0.25em]">
        TURNED TABLES TEST BUILD 12345
      </h1>

      <p className="text-cyan-300 text-xl mt-4">
        Explorer Academy Portal
      </p>

      <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm mt-2">
        Strategic Elemental Combat
      </p>

      <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
        Continue your scientific journey, earn XP,
        unlock badges, collect skins, and rise through
        the ranks of the Explorer Academy.
      </p>
    </div>

    {/* Info Cards */}
    <div className="grid md:grid-cols-3 gap-6 mb-10">

      <div className="bg-slate-900/70 border border-yellow-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="font-semibold">
            Monthly Challenge
          </h2>
        </div>

        <p className="text-slate-300 text-sm">
          Dr. Quark has developed a new quantum strategy.
        </p>

        <p className="text-yellow-300 mt-3 font-semibold">
          Reward: +300 XP
        </p>
      </div>

      <div className="bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold">
            Academy News
          </h2>
        </div>

        <ul className="text-slate-300 text-sm space-y-2">
          <li>• Explorer Accounts are online.</li>
          <li>• XP synchronization is underway.</li>
          <li>• New cosmetics arriving soon.</li>
        </ul>
      </div>

      <div className="bg-slate-900/70 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold">
            Academy Benefits
          </h2>
        </div>

        <ul className="text-slate-300 text-sm space-y-2">
          <li>✓ Earn XP</li>
          <li>✓ Unlock Badges</li>
          <li>✓ Collect Skins</li>
          <li>✓ Track Progress</li>
        </ul>
      </div>

    </div>

    {/* Login Card */}
    <div className="max-w-lg mx-auto bg-slate-900/80 border border-cyan-900 rounded-2xl p-6 shadow-xl">

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

      <div className="mt-6 text-center text-xs text-slate-500">
        Secure Academy Authentication System
      </div>
    </div>

  </div>
</div>

);
}
