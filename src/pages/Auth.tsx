import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast.error('Supabase is not configured. Please add env vars.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Signed up successfully! Please check your email.');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-card border border-border rounded-2xl box-glow">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-glow text-white mb-2">IkramiFy FX</h1>
        <p className="text-gray-400">{isLogin ? 'Welcome back' : 'Create an account'}</p>
      </div>

      {!isSupabaseConfigured() && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          <strong>Setup Required:</strong> Please configure your Supabase URL and Anon Key in the environment variables to enable authentication.
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-darker border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-darker border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-neon text-darker font-bold px-4 py-2.5 rounded-lg hover:bg-neon/90 transition-all mt-6"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-gray-400 hover:text-neon transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
