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
          // IMPORTANT: this must match your deployed site
          emailRedirectTo: 'https://turned-tables.vercel.app',
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for the login link.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
          }}
        >
          {loading ? 'Sending link...' : 'Send Magic Link'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 10 }}>
          {message}
        </p>
      )}
    </div>
  );
}
