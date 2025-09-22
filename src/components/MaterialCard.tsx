import React from 'react';
import { Package, MapPin, Truck, DollarSign, Plus, Minus, AlertTriangle } from 'lucide-react';
import { Material } from '../types/material';

interface MaterialCardProps {
  material: Material;
  onTransaction: (type: 'check-in' | 'check-out') => void;
  userRole: string;
}

export default function MaterialCard({ material, onTransaction, userRole }: MaterialCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockPercentage = () => {
    return Math.min((material.currentStock / material.maxStock) * 100, 100);
  };

  const stockPercentage = getStockPercentage();

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{material.name}</h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{material.category}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
          {material.status === 'in-stock' && 'In Stock'}
          {material.status === 'low-stock' && 'Low Stock'}
          {material.status === 'out-of-stock' && 'Out of Stock'}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{material.description}</p>

      {/* Stock Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock Level</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {material.currentStock} / {material.maxStock} {material.unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              stockPercentage > 50 ? 'bg-green-500' : 
              stockPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${stockPercentage}%` }}
          ></div>
        </div>
        {material.currentStock <= material.minStock && material.currentStock > 0 && (
          <div className="flex items-center gap-1 mt-2 text-yellow-600">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-medium">Below minimum stock level</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">{material.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">{material.supplier}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">${material.unitCost.toFixed(2)}/{material.unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">Min: {material.minStock}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={() => onTransaction('check-in')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl transition-all duration-200 text-sm font-semibold border border-green-200 dark:border-green-800"
        >
          <Plus className="w-4 h-4" />
          Check In
        </button>
        <button
          onClick={() => onTransaction('check-out')}
          disabled={material.currentStock === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl transition-all duration-200 text-sm font-semibold border border-orange-200 dark:border-orange-800 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-200 dark:disabled:border-slate-600"
        >
          <Minus className="w-4 h-4" />
          Check Out
        </button>
      </div>
    </div>
  );
}