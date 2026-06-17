import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import {
  Sparkles,
  Trophy,
  BookOpen,
  Shield,
  Send,
  Atom,
  FlaskConical,
  Zap,
  Users,
} from 'lucide-react';

const FLOATING_ELEMENTS = ['H', 'Fe', 'O', 'Na', 'C', 'Au', 'K', 'Li', 'Ca', 'N', 'Ag', 'Cu'];

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

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
        setMessage('Check your email for your Academy access link.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Real-Time PvP',
      desc: 'Challenge chemists worldwide in live atomic battles',
      color: 'cyan',
      border: 'border-cyan-500/30',
      bg: 'from-cyan-950/60 to-cyan-900/20',
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      glow: 'shadow-[0_0_40px_rgba(34,211,238,0.1)]',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: '3v3 Team Co-op',
      desc: 'Combine forces with allies in strategic team wars',
      color: 'amber',
      border: 'border-amber-500/30',
      bg: 'from-amber-950/60 to-amber-900/20',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.1)]',
    },
    {
      icon: <FlaskConical className="w-5 h-5" />,
      title: 'Compound Crafting',
      desc: 'Synthesize real chemical compounds for devastating power-ups',
      color: 'emerald',
      border: 'border-emerald-500/30',
      bg: 'from-emerald-950/60 to-emerald-900/20',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.1)]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070c15] overflow-hidden relative flex flex-col items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-cyan-500/[0.07] rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[70%] h-[70%] bg-blue-500/[0.06] rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-[40%] left-[50%] w-[50%] h-[50%] bg-teal-500/[0.04] rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
      </div>

      {/* Floating element symbols */}
      {FLOATING_ELEMENTS.map((el, i) => (
        <motion.div
          key={el}
          className="absolute text-white/[0.04] font-mono font-bold select-none pointer-events-none"
          style={{
            fontSize: `${28 + (i % 4) * 16}px`,
            top: `${8 + (i * 17) % 80}%`,
            left: `${5 + (i * 23) % 85}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          {el}
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          {/* Atom icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_80px_rgba(34,211,238,0.2)]">
                <Atom className="w-10 h-10 text-cyan-400" />
              </div>
              {/* Orbiting dots */}
              <motion.div
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ top: -4, left: '50%', transformOrigin: '50% 44px' }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ top: 20, left: -4, transformOrigin: '44px 10px' }}
              />
            </div>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[0.15em] text-white leading-none">
            TURNED
            <span className="block text-cyan-400">TABLES</span>
          </h1>

          <p className="text-slate-400 text-sm mt-3 tracking-[0.2em] uppercase font-semibold">
            Explorer Academy Portal
          </p>

          <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Master the periodic table, synthesize compounds, and battle in real-time strategic elemental combat.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              onHoverStart={() => setHoveredFeature(i)}
              onHoverEnd={() => setHoveredFeature(null)}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative bg-gradient-to-b ${f.bg} border ${f.border} rounded-2xl p-5 cursor-default overflow-hidden ${f.glow}`}
            >
              <div className={`w-10 h-10 rounded-xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-3`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-white/[0.02] rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredFeature === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl shadow-cyan-500/[0.05]">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">Secure Access</span>
              </div>
              <h2 className="text-lg font-bold text-white">Enter the Academy</h2>
              <p className="text-slate-400 text-xs mt-1">Sign in with your email to begin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Researcher Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed transition-all rounded-xl py-3 font-semibold text-white text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending Academy Link...' : 'Enter Explorer Academy'}
              </button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center text-cyan-300 text-xs bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2.5"
              >
                {message}
              </motion.div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-700/50 text-center">
              <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                Academy Authentication System
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 flex items-center justify-center gap-8 text-center"
        >
          <div>
            <p className="text-xl font-black text-white">118</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Elements</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <p className="text-xl font-black text-white">30+</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Compounds</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <p className="text-xl font-black text-cyan-400">Live</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Multiplayer</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
