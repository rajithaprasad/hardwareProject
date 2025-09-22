import React, { useState, useEffect } from 'react';
import { Plus, Calculator, Trash2, FileText, Download } from 'lucide-react';
import { Material } from '../types/material';
import { toast } from 'react-hot-toast';

interface QuotationItem {
  id: string;
  itemNumber: number;
  materialId: string;
  materialName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  priceAfterDiscount: number;
}

interface QuotationViewProps {
  canModify: boolean;
}

export default function QuotationView({ canModify }: QuotationViewProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [clientName, setClientName] = useState('');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php');
      const data = await response.json();
      setMaterials(data.map((material: any) => ({
        ...material,
        unitCost: parseFloat(material.unitCost) || 0,
        quantity: parseInt(material.quantity) || 0,
        minStockLevel: parseInt(material.minStockLevel) || 0,
        lastUpdated: new Date(material.lastUpdated)
      })));
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to fetch materials');
    }
  };

  const addMaterialToQuotation = () => {
    if (!selectedMaterial || quantity <= 0) {
      toast.error('Please select a material and enter valid quantity');
      return;
    }

    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return;

    const totalPrice = material.unitCost * quantity;
    const priceAfterDiscount = totalPrice - (totalPrice * discount / 100);

    const newItem: QuotationItem = {
      id: Date.now().toString(),
      itemNumber: quotationItems.length + 1,
      materialId: material.id,
      materialName: material.name,
      description: material.description,
      quantity,
      unitPrice: material.unitCost,
      totalPrice,
      discount,
      priceAfterDiscount
    };

    setQuotationItems(prev => [...prev, newItem]);
    setSelectedMaterial('');
    setQuantity(1);
    setDiscount(0);
    toast.success('Material added to quotation');
  };

  const removeMaterialFromQuotation = (itemId: string) => {
    setQuotationItems(prev => prev.filter(item => item.id !== itemId));
    // Renumber items
    setQuotationItems(prev => prev.map((item, index) => ({
      ...item,
      itemNumber: index + 1
    })));
    toast.success('Material removed from quotation');
  };

  const getTotalAmount = () => {
    return quotationItems.reduce((sum, item) => sum + item.priceAfterDiscount, 0);
  };

  const getTotalDiscount = () => {
    return quotationItems.reduce((sum, item) => sum + (item.totalPrice - item.priceAfterDiscount), 0);
  };

  const generateQuotation = () => {
    if (quotationItems.length === 0) {
      toast.error('Please add materials to the quotation');
      return;
    }
    if (!clientName.trim()) {
      toast.error('Please enter client name');
      return;
    }
    
    // Here you would typically generate a PDF or send to backend
    toast.success('Quotation generated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotation Management</h1>
              <p className="text-gray-600 dark:text-gray-400">Create price quotations for clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quotation Date
            </label>
            <input
              type="date"
              value={quotationDate}
              onChange={(e) => setQuotationDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Add Material Section */}
      {canModify && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Material to Quotation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">Choose material...</option>
                {materials.map(material => (
                  <option key={material.id} value={material.id}>
                    {material.name} - ${material.unitCost.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 transition-all duration-200 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addMaterialToQuotation}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Items */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quotation Items</h2>
        {quotationItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Item #</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Material Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Unit Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Total Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Final Price</th>
                  {canModify && <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {quotationItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{item.itemNumber}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{item.materialName}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">{item.description}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{item.quantity}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">${item.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{item.discount}%</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">${item.priceAfterDiscount.toFixed(2)}</td>
                    {canModify && (
                      <td className="py-3 px-4">
                        <button
                          onClick={() => removeMaterialFromQuotation(item.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No materials added to quotation yet</p>
          </div>
        )}
      </div>

      {/* Quotation Summary */}
      {quotationItems.length > 0 && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quotation Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                ${quotationItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Discount:</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">
                -${getTotalDiscount().toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {canModify && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={generateQuotation}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                Generate Quotation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}