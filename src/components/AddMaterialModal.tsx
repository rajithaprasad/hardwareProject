import React, { useState } from "react";
import { X, Package } from "lucide-react";
import { Category, Subcategory, Material } from "../types/material";

interface AddMaterialModalProps {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  onClose: () => void;
  onAdd: (
    material: Omit<
      Material,
      "id" | "lastUpdated" | "status" | "qrCode" | "createdBy"
    > & { createdBy: string }
  ) => void;
  createdBy: string;
  units?: string[];
}

export default function AddMaterialModal({
  categories,
  subcategories,
  selectedCategoryId,
  selectedSubcategoryId,
  onClose,
  onAdd,
  createdBy,
  units: propUnits = [
    "pieces",
    "bags",
    "tons",
    "cubic yards",
    "linear feet",
    "square feet",
    "gallons",
    "boxes",
    "rolls",
    "sheets",
    "bundles",
    "pallets",
    "kilograms",
    "Gram",
    "liters",
    "milliliters",
  ],
}: AddMaterialModalProps) {
  const [formData, setFormData] = useState({
    subcategoryId: selectedSubcategoryId || "",
    name: "",
    description: "",
    unit: propUnits[0],
    currentStock: "",
    minStock: "",
    maxStock: "",
    unitCost: "",
    createdBy,
  });

  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryId || (categories.length > 0 ? categories[0].id : "")
  );

  const availableSubcategories = subcategories.filter(
    (sub) => sub.categoryId === selectedCategory
  );

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const firstSubcategory = subcategories.find(
      (sub) => sub.categoryId === categoryId
    );
    setFormData((prev) => ({
      ...prev,
      subcategoryId: firstSubcategory?.id || "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    if (name === "unitCost") {
      const decimalRegex = /^[0-9]*\.?[0-9]*$/;
      if (value === "" || decimalRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unitCostValue = formData.unitCost ? parseFloat(formData.unitCost) : 0;
    onAdd({
      ...formData,
      currentStock: Number(formData.currentStock),
      minStock: Number(formData.minStock),
      maxStock: Number(formData.maxStock),
      unitCost: unitCostValue,
      category: undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Material
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="subcategoryId"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Subcategory *
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">Select subcategory...</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Material Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter material name"
              />
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Unit of Measurement *
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
              >
                {propUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="unitCost"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Unit Cost ($) *
              </label>
              <input
                type="number"
                id="unitCost"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="0.00"
              />
            </div>
            <div>
              <label
                htmlFor="currentStock"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Current Stock *
              </label>
              <input
                type="number"
                id="currentStock"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="0"
              />
            </div>
            <div>
              <label
                htmlFor="minStock"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Minimum Stock Level *
              </label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="0"
              />
            </div>
            <div>
              <label
                htmlFor="maxStock"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Maximum Stock Level *
              </label>
              <input
                type="number"
                id="maxStock"
                name="maxStock"
                value={formData.maxStock}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="100"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter material description..."
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Material
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}