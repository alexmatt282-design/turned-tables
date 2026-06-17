import { useState } from 'react';
import { supabase } from '../lib/supabase';

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
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #07111f 0%, #0d1f33 50%, #08111a 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(120,220,255,0.25)',
          borderRadius: 16,
          padding: 32,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px rgba(0,180,255,0.15)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 10 }}>
          ⚛️
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
