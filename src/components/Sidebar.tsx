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
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'construction-sites', label: 'Construction Sites', icon: Building2 },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'tools', label: 'Tools Management', icon: Settings },
  { id: 'staff', label: 'Staff Management', icon: UserPlus },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'quotation', label: 'Quotation', icon: Calculator },
  { id: 'report', label: 'Report', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const employeeMenuItems = [
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'tools', label: 'My Tools', icon: Settings },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'attendance', label: 'Attendance', icon: Clock },
];

export default function Sidebar({ activeSection, onSectionChange, userRole, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = userRole === 'employee' ? employeeMenuItems : adminMenuItems;

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/30 dark:border-slate-700/30 h-full flex flex-col transition-all duration-300 shadow-sm`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">MaterialFlow</h2>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                    {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              © 2025 MaterialFlow Pro
            </p>
          </div>
        </div>
      )}
    </div>
  );
}