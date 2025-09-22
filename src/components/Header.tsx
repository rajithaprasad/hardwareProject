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
      case 'manager': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'director': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'employee': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'secretary': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Construction Material Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Professional inventory system</p>
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-slate-700 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user.full_name}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                {getRoleDisplay(user.role)}
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}