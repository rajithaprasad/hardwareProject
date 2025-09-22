import React, { useState } from 'react';
import { Plus, FileText, Search, Calendar, User, Building2, Image, Upload } from 'lucide-react';
import { Note, ConstructionSite } from '../types/material';
import { mockNotes, mockConstructionSites } from '../data/mockData';

interface NotesViewProps {
  userRole: string;
  userId: string;
  userName: string;
}

export default function NotesView({ userRole, userId, userName }: NotesViewProps) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    constructionSiteId: '',
    imageFile: null as File | null
  });

  const isEmployee = userRole === 'employee';
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return isEmployee ? (matchesSearch && note.employeeId === userId) : matchesSearch;
  });

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim() || !newNote.constructionSiteId) return;

    const constructionSite = mockConstructionSites.find(site => site.id === newNote.constructionSiteId);
    const note: Note = {
      id: `n${Date.now()}`,
      employeeId: userId,
      employeeName: userName,
      constructionSiteId: newNote.constructionSiteId,
      constructionSiteName: constructionSite?.name || '',
      title: newNote.title,
      content: newNote.content,
      imageUrl: newNote.imageFile ? URL.createObjectURL(newNote.imageFile) : undefined,
      createdAt: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', constructionSiteId: '', imageFile: null });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEmployee ? 'Your construction site notes' : 'All employee notes'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {note.imageUrl && (
              <div className="w-full h-48 bg-gray-100 dark:bg-slate-700 rounded-xl mb-4 overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt="Note attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {note.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {note.content}
            </p>

            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3" />
                <span>{note.constructionSiteName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>{note.employeeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{note.createdAt.toLocaleDateString()} {note.createdAt.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first note to get started'}
          </p>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Note</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Construction Site *
                </label>
                <select
                  value={newNote.constructionSiteId}
                  onChange={(e) => setNewNote(prev => ({ ...prev, constructionSiteId: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Select construction site...</option>
                  {mockConstructionSites.filter(site => site.isActive).map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter note content..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Attach Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6">
                  <div className="text-center">
                    <Image className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewNote(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                        className="hidden"
                      />
                    </label>
                    {newNote.imageFile && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Selected: {newNote.imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim() || !newNote.constructionSiteId}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}