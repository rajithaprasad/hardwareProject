import React, { useState, useEffect } from 'react';
import { Plus, Users, Shield, Trash2, Search, Calendar, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockUsers } from '../data/mockData';
import AddStaffModal from './AddStaffModal';
import ConfirmationModal from './ConfirmationModal';

interface Staff {
  id: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface StaffViewProps {
  canModify: boolean;
}

export default function StaffView({ canModify }: StaffViewProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    setStaff(mockUsers);
  }, []);

  const handleAddStaff = async (staffData: {
    username: string;
    password: string;
    full_name: string;
    role: string;
  }) => {
    const newStaff = {
      id: `staff${Date.now()}`,
      username: staffData.username,
      fullName: staffData.full_name,
      role: staffData.role,
      created_at: new Date().toISOString()
    };
    setStaff(prev => [...prev, newStaff]);
    toast.success('Staff member added successfully');
  };

  const handleDeleteStaff = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Staff Member',
      message: `Are you sure you want to delete "${staffMember.fullName}"? This action cannot be undone.`,
      onConfirm: async () => {
        setStaff(prev => prev.filter(s => s.id !== staffId));
        toast.success('Staff member deleted successfully');
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

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
      case 'manager': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'director': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'employee': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'secretary': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const filteredStaff = staff.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage system users and their roles</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{staff.length} staff members</span>
                </div>
              </div>
            </div>
          </div>
          {canModify && (
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Staff
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search staff members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                {getRoleDisplay(member.role)}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {member.fullName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">@{member.username}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Added {new Date(member.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {canModify && (
              <button
                onClick={() => handleDeleteStaff(member.id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No staff members found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Add the first staff member to get started'}
          </p>
        </div>
      )}

      {/* Modals */}
      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onAdd={handleAddStaff}
        />
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </div>
  );
}