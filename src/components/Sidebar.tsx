import React, { useState } from 'react';
import { 
  Layers, 
  Building2, 
  Users, 
  FileText, 
  Calculator, 
  BarChart3, 
  Settings,
  UserPlus,
  Clock,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const adminMenuItems = [
  { id: 'categories', label: 'Categories', icon: Layers, color: 'from-violet-500 to-purple-600' },
  { id: 'construction-sites', label: 'Construction Sites', icon: Building2, color: 'from-blue-500 to-indigo-600' },
  { id: 'employees', label: 'Employees', icon: Users, color: 'from-emerald-500 to-green-600' },
  { id: 'tools', label: 'Tools Management', icon: Settings, color: 'from-amber-500 to-orange-600' },
  { id: 'staff', label: 'Staff Management', icon: UserPlus, color: 'from-rose-500 to-pink-600' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-teal-500 to-cyan-600' },
  { id: 'quotation', label: 'Quotation', icon: Calculator, color: 'from-indigo-500 to-blue-600' },
  { id: 'report', label: 'Report', icon: BarChart3, color: 'from-purple-500 to-violet-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-gray-600' },
];

const employeeMenuItems = [
  { id: 'categories', label: 'Categories', icon: Layers, color: 'from-violet-500 to-purple-600' },
  { id: 'tools', label: 'My Tools', icon: Settings, color: 'from-amber-500 to-orange-600' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-teal-500 to-cyan-600' },
  { id: 'attendance', label: 'Attendance', icon: Clock, color: 'from-blue-500 to-indigo-600' },
];

export default function Sidebar({ activeSection, onSectionChange, userRole, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = userRole === 'employee' ? employeeMenuItems : adminMenuItems;

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-700/60 h-full flex flex-col transition-all duration-500 shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/20`}>
      {/* Logo Section */}
      <div className="p-8 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:shadow-2xl group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
                  MaterialFlow
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wider uppercase">
                  Pro Edition
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`group w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-start px-5'} py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-xl shadow-${item.color.split('-')[1]}-500/25 scale-105`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:text-slate-900 dark:hover:text-white hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-slate-900/30 hover:scale-102'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  )}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'group-hover:bg-slate-200/50 dark:group-hover:bg-slate-600/50'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                      }`} />
                    </div>
                    {!isCollapsed && (
                      <span className="font-bold text-sm tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold tracking-wider uppercase">
                System Online
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              © 2025 MaterialFlow Pro
            </p>
          </div>
        </div>
      )}
    </div>
  );
}