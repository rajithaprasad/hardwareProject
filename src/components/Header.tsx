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
      case 'manager': return 'text-red-600 dark:text-red-400';
      case 'director': return 'text-blue-600 dark:text-blue-400';
      case 'employee': return 'text-green-600 dark:text-green-400';
      case 'secretary': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-orange-600 dark:text-orange-400';
    }
  };

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200/30 dark:border-slate-700/30 px-6 py-4 transition-colors duration-300 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              MaterialFlow Pro
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Advanced Material Management
            </p>
          </div>
        </div>

        {/* User Info, Theme Toggle, and Logout */}
        <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 sm:gap-4 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user.full_name}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleDisplay(user.role)}
                  </span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
