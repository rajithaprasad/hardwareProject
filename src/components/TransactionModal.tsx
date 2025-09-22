import React, { useState } from 'react';
import { X, Plus, Minus, Package, MapPin } from 'lucide-react';
import { Material, ConstructionSite } from '../types/material';

interface TransactionModalProps {
  material: Material;
  type: 'check-in' | 'check-out';
  constructionSites: ConstructionSite[];
  onClose: () => void;
  onTransaction: (
    materialId: string,
    type: 'check-in' | 'check-out',
    quantity: number,
    reason: string,
    constructionSite?: string,
    user?: string,
    userRole?: string
  ) => void;
  user?: string;
  userRole: string;
}

export default function TransactionModal({
  material,
  type,
  constructionSites,
  onClose,
  onTransaction,
  user,
  userRole,
}: TransactionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [constructionSite, setConstructionSite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && reason.trim()) {
      onTransaction(
        material.id,
        type,
        quantity,
        reason.trim(),
        constructionSite || undefined,
        user,
        userRole
      );
      onClose();
    }
  };

  const maxCheckOut = material.currentStock;
  const isCheckOutValid = type === 'check-in' || quantity <= maxCheckOut;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                type === 'check-in'
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-orange-500 to-red-500'
              }`}
            >
              {type === 'check-in' ? (
                <Plus className="w-5 h-5 text-white" />
              ) : (
                <Minus className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {type === 'check-in' ? 'Check In' : 'Check Out'} Material
              </h2>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {material.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Current Stock: {material.currentStock} {material.unit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {material.location}
              </span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Quantity ({material.unit}) *
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max={type === 'check-out' ? maxCheckOut : undefined}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
            />
            {type === 'check-out' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                Maximum available: {maxCheckOut} {material.unit}
              </p>
            )}
            {!isCheckOutValid && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                Insufficient stock. Available: {maxCheckOut} {material.unit}
              </p>
            )}
          </div>
          {type === 'check-out' && (
            <div>
              <label
                htmlFor="constructionSite"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Construction Site *
              </label>
              <select
                id="constructionSite"
                value={constructionSite}
                onChange={(e) => setConstructionSite(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              >
                <option value="">Select construction site...</option>
                {constructionSites.map((site) => (
                  <option key={site.id} value={site.name}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Reason *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={
                type === 'check-in'
                  ? 'New delivery, return from job site, etc.'
                  : 'Foundation pour, framing work, etc.'
              }
            />
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
              disabled={!isCheckOutValid || !reason.trim() || (type === 'check-out' && !constructionSite)}
              className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-300 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none ${
                type === 'check-in'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              }`}
            >
              {type === 'check-in' ? 'Add to Stock' : 'Withdraw from Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
