import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';

interface AddStaffModalProps {
  onClose: () => void;
  onAdd: (staffData: {
    username: string;
    password: string;
    full_name: string;
    role: string;
  }) => void;
}

export default function AddStaffModal({ onClose, onAdd }: AddStaffModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'employee'
  });

  const roles = [
    { value: 'manager', label: 'Manager', color: 'text-red-600 dark:text-red-400' },
    { value: 'director', label: 'Director', color: 'text-blue-600 dark:text-blue-400' },
    { value: 'employee', label: 'Employee', color: 'text-green-600 dark:text-green-400' },
    { value: 'secretary', label: 'Secretary', color: 'text-purple-600 dark:text-purple-400' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Staff</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter full name"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter password"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1 mb-1">
                <Shield className="w-3 h-3" />
                <span className="font-medium">Role Permissions:</span>
              </div>
              <ul className="ml-4 space-y-1">
                <li><span className="text-red-600 dark:text-red-400 font-medium">Manager:</span> Full access to all features</li>
                <li><span className="text-blue-600 dark:text-blue-400 font-medium">Director:</span> Full access to all features</li>
                <li><span className="text-green-600 dark:text-green-400 font-medium">Employee:</span> Can withdraw materials</li>
                <li><span className="text-purple-600 dark:text-purple-400 font-medium">Secretary:</span> Can add materials to stock</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}