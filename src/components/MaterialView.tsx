import React from 'react';
import { Plus, Package, MapPin, DollarSign, QrCode, Calendar, User, Trash2 } from 'lucide-react';
import { Category, Material } from '../types/material';

interface MaterialViewProps {
  category: Category;
  materials: Material[];
  onMaterialClick: (materialId: string) => void;
  canModify: boolean;
  onAddMaterial: () => void;
  onDeleteMaterial: (materialId: string) => void;
}

export default function MaterialView({
  category,
  materials,
  onMaterialClick,
  canModify,
  onAddMaterial,
  onDeleteMaterial,
}: MaterialViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getStockPercentage = (material: Material) => {
    return Math.min((material.currentStock / material.maxStock) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {category.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>by {category.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
          {canModify && (
            <button
              onClick={onAddMaterial}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Material
            </button>
          )}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {materials.map(material => {
          const stockPercentage = getStockPercentage(material);
          return (
            <div
              key={material.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              {/* Header and Delete Button */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    onClick={() => onMaterialClick(material.id)}
                    className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {material.name}
                  </h3>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(material.status)}`}>
                    {material.status === 'in-stock' && 'In Stock'}
                    {material.status === 'low-stock' && 'Low Stock'}
                    {material.status === 'out-of-stock' && 'Out of Stock'}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Description */}
              <p
                onClick={() => onMaterialClick(material.id)}
                className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 cursor-pointer"
              >
                {material.description}
              </p>

              {/* Stock Level */}
              <div
                onClick={() => onMaterialClick(material.id)}
                className="mb-4 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock Level</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {material.currentStock} / {material.maxStock} {material.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      stockPercentage > 50 ? 'bg-green-500' :
                      stockPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Details */}
              <div
                onClick={() => onMaterialClick(material.id)}
                className="grid grid-cols-2 gap-4 text-sm cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium truncate">{material.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">${material.unitCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <QrCode className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium font-mono text-xs">{material.qrCode}</span>
                </div>
              </div>

              {/* Delete Button */}
              {canModify && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMaterial(material.id);
                  }}
                  className="mt-4 flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No materials found in this category</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {canModify ? 'Add the first material to get started' : 'This category has no materials yet'}
          </p>
        </div>
      )}
    </div>
  );
}
