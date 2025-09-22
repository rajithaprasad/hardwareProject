import React from 'react';
import { 
  Layers, 
  Building2, 
  Users, 
  FileText, 
  Calculator, 
  BarChart3, 
  Settings,
  UserPlus,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'construction-sites', label: 'Construction Sites', icon: Building2 },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'staff', label: 'Staff Management', icon: UserPlus },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'quotation', label: 'Quotation', icon: Calculator },
  { id: 'report', label: 'Report', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-700/50 h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">MaterialFlow</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Management System</p>
          </div>
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white rotate-90' : 'text-gray-400 group-hover:translate-x-1'
                  }`} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 MaterialFlow Pro
          </p>
        </div>
      </div>
    </div>
  );
}