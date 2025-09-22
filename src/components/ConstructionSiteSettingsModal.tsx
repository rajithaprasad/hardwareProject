import React, { useState } from 'react';
import { Building2, Plus, Trash2, X } from 'lucide-react';

interface ConstructionSiteSettingsModalProps {
  constructionSites: ConstructionSite[];
  onClose: () => void;
  onAdd: (name: string, address: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface ConstructionSite {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export default function ConstructionSiteSettingsModal({
  constructionSites,
  onClose,
  onAdd,
  onDelete,
}: ConstructionSiteSettingsModalProps) {
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteAddress, setNewSiteAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteAddress.trim()) return;
    await onAdd(newSiteName, newSiteAddress);
    setNewSiteName('');
    setNewSiteAddress('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Construction Sites Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Construction Site</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter site name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter site address"
                  rows={2}
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Site
              </button>
            </div>
          </form>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Existing Sites</h3>
            {constructionSites.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No construction sites found</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {constructionSites.map((site) => (
                  <div key={site.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{site.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{site.address}</p>
                    </div>
                    <button
                      onClick={() => onDelete(site.id)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete site"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
