import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      const res = await fetch('https://<YOUR_RENDER_BACKEND_URL>/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) setMessage(data.error);
      else setMessage('User created!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Signup</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 mb-2"
      />
      <button onClick={handleSignup} className="bg-blue-500 text-white p-2">
        Signup
      </button>
      <p className="mt-2">{message}</p>
    </div>
  );
}
