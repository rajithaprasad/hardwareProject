import React, { useState } from 'react';
import { Plus, Settings, Search, Calendar, User, Trash2, Eye, FileText, Image, Download } from 'lucide-react';
import { Tool, ManagerNote } from '../types/material';
import { mockTools, mockUsers, mockManagerNotes } from '../data/mockData';
import { toast } from 'react-hot-toast';

interface ToolsViewProps {
  userRole: string;
  userId: string;
  userName: string;
  canModify: boolean;
}

export default function ToolsView({ userRole, userId, userName, canModify }: ToolsViewProps) {
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [managerNotes, setManagerNotes] = useState<ManagerNote[]>(mockManagerNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const isEmployee = userRole === 'employee';
  const currentUser = mockUsers.find(u => u.username === userName);
  const currentUserId = currentUser?.id || userId;

  // Filter tools based on user role
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.toolBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.manufacturerSerialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isEmployee) {
      return matchesSearch && tool.assignedEmployeeId === currentUserId;
    }
    return matchesSearch;
  });

  // Get manager notes for current employee
  const employeeNotes = managerNotes.filter(note => 
    isEmployee ? note.targetEmployeeId === currentUserId : true
  );

  const handleAddTool = (toolData: Omit<Tool, 'id' | 'createdAt'>) => {
    const newTool: Tool = {
      ...toolData,
      id: `t${Date.now()}`,
      createdAt: new Date()
    };
    setTools(prev => [...prev, newTool]);
    toast.success('Tool added successfully');
  };

  const handleAddManagerNote = (noteData: Omit<ManagerNote, 'id' | 'createdAt' | 'isRead'>) => {
    const newNote: ManagerNote = {
      ...noteData,
      id: `mn${Date.now()}`,
      createdAt: new Date(),
      isRead: false
    };
    setManagerNotes(prev => [...prev, newNote]);
    toast.success('Manager note added successfully');
  };

  const handleAssignTool = (toolId: string, employeeId: string) => {
    const employee = mockUsers.find(u => u.id === employeeId);
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, assignedEmployeeId: employeeId, assignedEmployeeName: employee?.fullName }
        : tool
    ));
    toast.success('Tool assigned successfully');
  };

  const handleUnassignTool = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId 
        ? { ...tool, assignedEmployeeId: undefined, assignedEmployeeName: undefined }
        : tool
    ));
    toast.success('Tool unassigned successfully');
  };

  const markNoteAsRead = (noteId: string) => {
    setManagerNotes(prev => prev.map(note =>
      note.id === noteId ? { ...note, isRead: true } : note
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEmployee ? 'My Tools' : 'Tools Management'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEmployee ? 'View your assigned tools' : 'Manage work tools and assignments'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {canModify && (
              <>
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FileText className="w-5 h-5" />
                  Add Manager Note
                </button>
                <button
                  onClick={() => setShowAddToolModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add Tool
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Manager Notes for Employees */}
      {isEmployee && employeeNotes.length > 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Manager Notes</h2>
          <div className="space-y-4">
            {employeeNotes.map(note => (
              <div
                key={note.id}
                className={`p-4 rounded-xl border ${
                  note.isRead 
                    ? 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{note.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{note.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>From: {note.createdByName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{note.createdAt.toLocaleDateString()} {note.createdAt.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  {!note.isRead && (
                    <button
                      onClick={() => markNoteAsRead(note.id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tool.quantity}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Quantity
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {tool.toolBrand}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">
              S/N: {tool.manufacturerSerialNumber}
            </p>

            {tool.photos.length > 0 && (
              <div className="mb-4">
                <img
                  src={tool.photos[0]}
                  alt="Tool"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Entry Date:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {tool.entryDate.toLocaleDateString()}
                </span>
              </div>
              {tool.exitDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Exit Date:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {tool.exitDate.toLocaleDateString()}
                  </span>
                </div>
              )}
              {tool.assignedEmployeeName && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {tool.assignedEmployeeName}
                  </span>
                </div>
              )}
            </div>

            {tool.documents.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Documents:</p>
                <div className="flex flex-wrap gap-1">
                  {tool.documents.map((doc, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {canModify && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedTool(tool)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl transition-all duration-200 text-sm font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  Manage
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 
             isEmployee ? 'No tools assigned to you yet' : 'Add the first tool to get started'}
          </p>
        </div>
      )}

      {/* Add Tool Modal */}
      {showAddToolModal && (
        <AddToolModal
          onClose={() => setShowAddToolModal(false)}
          onAdd={handleAddTool}
          createdBy={userName}
        />
      )}

      {/* Add Manager Note Modal */}
      {showAddNoteModal && (
        <AddManagerNoteModal
          onClose={() => setShowAddNoteModal(false)}
          onAdd={handleAddManagerNote}
          createdBy={currentUserId}
          createdByName={userName}
        />
      )}

      {/* Tool Management Modal */}
      {selectedTool && (
        <ToolManagementModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onAssign={handleAssignTool}
          onUnassign={handleUnassignTool}
        />
      )}
    </div>
  );
}

// Add Tool Modal Component
interface AddToolModalProps {
  onClose: () => void;
  onAdd: (tool: Omit<Tool, 'id' | 'createdAt'>) => void;
  createdBy: string;
}

function AddToolModal({ onClose, onAdd, createdBy }: AddToolModalProps) {
  const [formData, setFormData] = useState({
    toolBrand: '',
    manufacturerSerialNumber: '',
    quantity: 1,
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: '',
    assignedEmployeeId: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockUsers.find(u => u.id === formData.assignedEmployeeId);
    
    onAdd({
      ...formData,
      entryDate: new Date(formData.entryDate),
      exitDate: formData.exitDate ? new Date(formData.exitDate) : undefined,
      assignedEmployeeName: employee?.fullName,
      documents: documents.map(doc => doc.name),
      photos: photos.map(photo => URL.createObjectURL(photo)),
      createdBy
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Tool</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tool Brand *
              </label>
              <input
                type="text"
                value={formData.toolBrand}
                onChange={(e) => setFormData(prev => ({ ...prev, toolBrand: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter tool brand"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Serial Number *
              </label>
              <input
                type="text"
                value={formData.manufacturerSerialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturerSerialNumber: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                min="1"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Entry Date *
              </label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Exit Date (Optional)
              </label>
              <input
                type="date"
                value={formData.exitDate}
                onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Assign to Employee
              </label>
              <select
                value={formData.assignedEmployeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedEmployeeId: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">Select employee...</option>
                {mockUsers.filter(user => user.role === 'employee').map(user => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
            </div>
          </div>

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
              Add Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Manager Note Modal Component
interface AddManagerNoteModalProps {
  onClose: () => void;
  onAdd: (note: Omit<ManagerNote, 'id' | 'createdAt' | 'isRead'>) => void;
  createdBy: string;
  createdByName: string;
}

function AddManagerNoteModal({ onClose, onAdd, createdBy, createdByName }: AddManagerNoteModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetEmployeeId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockUsers.find(u => u.id === formData.targetEmployeeId);
    
    onAdd({
      ...formData,
      targetEmployeeName: employee?.fullName || '',
      createdBy,
      createdByName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Manager Note</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Employee *
            </label>
            <select
              value={formData.targetEmployeeId}
              onChange={(e) => setFormData(prev => ({ ...prev, targetEmployeeId: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">Choose employee...</option>
              {mockUsers.filter(user => user.role === 'employee').map(user => (
                <option key={user.id} value={user.id}>{user.fullName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter note content..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim() || !formData.targetEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tool Management Modal Component
interface ToolManagementModalProps {
  tool: Tool;
  onClose: () => void;
  onAssign: (toolId: string, employeeId: string) => void;
  onUnassign: (toolId: string) => void;
}

function ToolManagementModal({ tool, onClose, onAssign, onUnassign }: ToolManagementModalProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(tool.assignedEmployeeId || '');

  const handleAssign = () => {
    if (selectedEmployeeId) {
      onAssign(tool.id, selectedEmployeeId);
      onClose();
    }
  };

  const handleUnassign = () => {
    onUnassign(tool.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Tool</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tool.toolBrand}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">S/N: {tool.manufacturerSerialNumber}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {tool.quantity}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Assign to Employee
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">Select employee...</option>
              {mockUsers.filter(user => user.role === 'employee').map(user => (
                <option key={user.id} value={user.id}>{user.fullName}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            {tool.assignedEmployeeId && (
              <button
                onClick={handleUnassign}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Unassign
              </button>
            )}
            <button
              onClick={handleAssign}
              disabled={!selectedEmployeeId || selectedEmployeeId === tool.assignedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {tool.assignedEmployeeId ? 'Reassign' : 'Assign'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}