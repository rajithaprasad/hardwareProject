import React, { useState } from 'react';
import { Plus, Building2, Search, Calendar, User, Eye, MapPin } from 'lucide-react';
import { ConstructionSite, Note } from '../types/material';
import { mockConstructionSites, mockNotes } from '../data/mockData';
import { toast } from 'react-hot-toast';

interface ConstructionSitesViewProps {
  canModify: boolean;
}

export default function ConstructionSitesView({ canModify }: ConstructionSitesViewProps) {
  const [constructionSites, setConstructionSites] = useState<ConstructionSite[]>(mockConstructionSites);
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);

  const filteredSites = constructionSites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSiteNotes = (siteId: string) => {
    return notes.filter(note => note.constructionSiteId === siteId);
  };

  const handleAddSite = (siteData: Omit<ConstructionSite, 'id'>) => {
    const newSite: ConstructionSite = {
      ...siteData,
      id: `site${Date.now()}`
    };
    setConstructionSites(prev => [...prev, newSite]);
    toast.success('Construction site added successfully');
  };

  if (selectedSiteId) {
    const site = constructionSites.find(s => s.id === selectedSiteId);
    const siteNotes = getSiteNotes(selectedSiteId);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedSiteId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ← Back
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{site?.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">Employee Notes</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{site?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Site Notes */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Employee Notes ({siteNotes.length})
          </h2>
          
          {siteNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteNotes.map(note => (
                <div
                  key={note.id}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
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
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No employee notes have been added for this construction site yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Construction Sites</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage construction site locations and view employee notes</p>
            </div>
          </div>
          {canModify && (
            <button
              onClick={() => setShowAddSiteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Site
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search construction sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map(site => {
          const siteNotes = getSiteNotes(site.id);
          return (
            <div
              key={site.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  site.isActive 
                    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                    : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
                }`}>
                  {site.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {site.name}
              </h3>
              
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{site.address}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{siteNotes.length} employee notes</span>
              </div>

              <button
                onClick={() => setSelectedSiteId(site.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                <Eye className="w-4 h-4" />
                View Notes ({siteNotes.length})
              </button>
            </div>
          );
        })}
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No construction sites found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Add the first construction site to get started'}
          </p>
        </div>
      )}

      {/* Add Site Modal */}
      {showAddSiteModal && (
        <AddSiteModal
          onClose={() => setShowAddSiteModal(false)}
          onAdd={handleAddSite}
        />
      )}
    </div>
  );
}

// Add Site Modal Component
interface AddSiteModalProps {
  onClose: () => void;
  onAdd: (site: Omit<ConstructionSite, 'id'>) => void;
}

function AddSiteModal({ onClose, onAdd }: AddSiteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Construction Site</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter site name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter complete address"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active site
            </label>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}