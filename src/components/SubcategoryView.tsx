import React from 'react';
import { Plus, Package, Calendar, User, ArrowLeft, Trash2 } from 'lucide-react';
import { Category, Subcategory } from '../types/material';

interface SubcategoryViewProps {
  category: Category;
  subcategories: Subcategory[];
  onSubcategoryClick: (subcategoryId: string) => void;
  canModify: boolean;
  onAddSubcategory: () => void;
  onDeleteSubcategory: (subcategoryId: string) => void;
}

export default function SubcategoryView({
  category,
  subcategories,
  onSubcategoryClick,
  canModify,
  onAddSubcategory,
  onDeleteSubcategory,
}: SubcategoryViewProps) {
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
            {canModify && (
              <button
                onClick={onAddSubcategory}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add Subcategory
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div
              onClick={() => onSubcategoryClick(subcategory.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {subcategory.materialCount || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Materials</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {subcategory.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {subcategory.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{subcategory.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{subcategory.createdBy}</span>
                </div>
              </div>
            </div>
            {canModify && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSubcategory(subcategory.id);
                }}
                className="mt-4 flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {subcategories.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No subcategories found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {canModify ? 'Add the first subcategory to get started' : 'This category has no subcategories yet'}
          </p>
        </div>
      )}
    </div>
  );
}
