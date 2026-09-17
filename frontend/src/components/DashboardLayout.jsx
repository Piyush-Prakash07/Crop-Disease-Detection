import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, ScanLine, History, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'success');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080b11] text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 glass-panel md:min-h-screen border-r border-gray-800 flex flex-col justify-between">
        <div>
          {/* Brand Logo */}
          <div className="p-6 flex items-center gap-2 border-b border-gray-900">
            <Sprout className="w-8 h-8 text-emerald-400" />
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              AgriGuard
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/dashboard')
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </Link>

            <Link
              to="/predict"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/predict')
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ScanLine className="w-5 h-5" /> Analyze Leaf
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/history')
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-5 h-5" /> Scans History
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin')
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500 pl-3'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-5 h-5" /> Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-gray-900 bg-black/10 flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Signed in as</p>
            <p className="text-sm font-bold text-white truncate max-w-[140px]">{user?.name || 'Farmer'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar header */}
        <header className="glass-panel py-4 px-6 md:px-8 flex items-center justify-between border-b border-gray-800">
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none my-0">
            {isActive('/dashboard') && 'Dashboard'}
            {isActive('/predict') && 'Disease Diagnostics'}
            {isActive('/history') && 'Historical Records'}
            {isActive('/admin') && 'Administrator Workspace'}
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              user?.role === 'admin' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            }`}>
              {user?.role === 'admin' ? 'Admin' : 'Farmer'}
            </span>
          </div>
        </header>

        {/* Dynamic page contents wrapper */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
