import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter email and password.', 'error');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      addToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate('/dashboard');
    } else {
      addToast(result.error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080b11] px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-gray-800 shadow-2xl animate-fade-in-up">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
          <p className="text-sm text-gray-400 mt-1">Access your agricultural diagnostics workspace</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="john@farm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white placeholder-gray-600 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f131a] border border-gray-800 hover:border-emerald-500/30 focus:border-emerald-500/70 focus:outline-none rounded-xl text-white placeholder-gray-600 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:shadow-emerald-950/40 hover:brightness-105 active:translate-y-[1px] transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Note about default admin */}
        <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center text-xs text-emerald-400">
          <strong>Admin Login:</strong> admin@cropdetector.com / AdminPassword123
        </div>

        {/* Redirect */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
