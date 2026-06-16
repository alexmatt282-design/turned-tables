import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for a login link.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Turned Tables Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3"
        />

        <button
          onClick={signIn}
          className="w-full border p-2"
        >
          Sign In
        </button>

        {message && (
          <p className="mt-3">{message}</p>
        )}
      </div>
    </div>
  );
}