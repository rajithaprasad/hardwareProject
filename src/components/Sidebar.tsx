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
  { id: 'categories', label: 'Categories', icon: Layers, color: 'from-purple-500 to-purple-600' },
  { id: 'construction-sites', label: 'Construction Sites', icon: Building2, color: 'from-blue-500 to-blue-600' },
  { id: 'employees', label: 'Employees', icon: Users, color: 'from-green-500 to-green-600' },
  { id: 'tools', label: 'Tools Management', icon: Settings, color: 'from-orange-500 to-orange-600' },
  { id: 'staff', label: 'Staff Management', icon: UserPlus, color: 'from-red-500 to-red-600' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-teal-500 to-teal-600' },
  { id: 'quotation', label: 'Quotation', icon: Calculator, color: 'from-indigo-500 to-indigo-600' },
  { id: 'report', label: 'Report', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
];

const employeeMenuItems = [
  { id: 'categories', label: 'Categories', icon: Layers, color: 'from-purple-500 to-purple-600' },
  { id: 'tools', label: 'My Tools', icon: Settings, color: 'from-orange-500 to-orange-600' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'from-teal-500 to-teal-600' },
  { id: 'attendance', label: 'Attendance', icon: Clock, color: 'from-blue-500 to-blue-600' },
];

export default function Sidebar({ activeSection, onSectionChange, userRole, isCollapsed }: SidebarProps) {
  const menuItems = userRole === 'employee' ? employeeMenuItems : adminMenuItems;

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700 h-full flex flex-col transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">MaterialFlow</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pro Edition</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'justify-start px-4'} py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 MaterialFlow Pro
            </p>
          </div>
        </div>
      )}
    </div>
  );
}