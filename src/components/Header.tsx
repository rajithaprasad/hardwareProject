import React from 'react';
import { Building2, LogOut, User, Sun, Moon, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  user: { username: string; role: string; full_name: string };
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'director': return 'Director';
      case 'employee': return 'Employee';
      case 'secretary': return 'Secretary';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
      case 'director': return 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20';
      case 'employee': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'secretary': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20';
      default: return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-700/60 px-8 py-5 transition-all duration-300 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl shadow-xl shadow-indigo-500/25">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
              MaterialFlow Pro
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold tracking-wide">
              Enterprise Material Management
            </p>
          </div>
        </div>

        {/* User Info, Theme Toggle, and Logout */}
        <div className="flex flex-row items-center gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-4 px-6 py-3.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200/80 dark:border-slate-600/80 shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border border-white dark:border-slate-800"></div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {user.full_name}
                  </span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getRoleColor(user.role)}`}>
                  {getRoleDisplay(user.role)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="group p-3.5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-600/80 shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 hover:-translate-y-0.5"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 group-hover:text-slate-600 transition-colors" />
              )}
            </button>

            <button
              onClick={onLogout}
              className="group flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 rounded-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-600/80 shadow-lg shadow-slate-200/30 dark:shadow-slate-900/30 hover:shadow-xl hover:shadow-red-200/40 dark:hover:shadow-red-900/40 hover:-translate-y-0.5"
            >
              <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}