import React, { useState, useEffect } from 'react';
import { BarChart3, Filter, Download, Calendar, Building2, User, Package } from 'lucide-react';
import { Material, Transaction, ConstructionSite } from '../types/material';
import { toast } from 'react-hot-toast';

interface Staff {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

interface ReportViewProps {
  canModify: boolean;
}

export default function ReportView({ canModify }: ReportViewProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [constructionSites, setConstructionSites] = useState<ConstructionSite[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    constructionSite: '',
    employee: '',
    material: '',
    transactionType: ''
  });

  const [reportData, setReportData] = useState<Transaction[]>([]);

  useEffect(() => {
    setMaterials(mockMaterials);
    setTransactions(mockTransactions);
    setConstructionSites(mockConstructionSites);
    setStaff(mockUsers.filter(user => user.role === 'employee'));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const applyFilters = () => {
    let filtered = [...transactions];

    if (filters.startDate) {
      filtered = filtered.filter(t => t.timestamp >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(t => t.timestamp <= new Date(filters.endDate));
    }

    if (filters.constructionSite) {
      filtered = filtered.filter(t => t.constructionSite === filters.constructionSite);
    }

    if (filters.employee) {
      filtered = filtered.filter(t => t.user === filters.employee);
    }

    if (filters.material) {
      filtered = filtered.filter(t => t.materialId === filters.material);
    }

    if (filters.transactionType) {
      filtered = filtered.filter(t => t.type === filters.transactionType);
    }

    setReportData(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      constructionSite: '',
      employee: '',
      material: '',
      transactionType: ''
    });
  };

  const calculateTotalCost = () => {
    return reportData.reduce((total, transaction) => {
      const material = materials.find(m => m.id === transaction.materialId);
      if (material) {
        return total + (material.unitCost * transaction.quantity);
      }
      return total;
    }, 0);
  };

  const exportReport = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    // Here you would typically generate a CSV or PDF
    toast.success('Report exported successfully');
  };

  const getMaterialName = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : 'Unknown Material';
  };

  const getMaterialCost = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.unitCost : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Material usage and cost analysis</p>
            </div>
          </div>
          {canModify && (
            <button
              onClick={exportReport}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Construction Site
            </label>
            <select
              value={filters.constructionSite}
              onChange={(e) => handleFilterChange('constructionSite', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">All Sites</option>
              {constructionSites.map(site => (
                <option key={site.id} value={site.name}>{site.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Employee
            </label>
            <select
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">All Employees</option>
              {staff.map(member => (
                <option key={member.id} value={member.full_name}>{member.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Material
            </label>
            <select
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">All Materials</option>
              {materials.map(material => (
                <option key={material.id} value={material.id}>{material.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Transaction Type
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 transition-all duration-200 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="check-in">Check In</option>
              <option value="check-out">Check Out</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check-ins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData.filter(t => t.type === 'check-in').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check-outs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData.filter(t => t.type === 'check-out').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${calculateTotalCost().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transaction Details</h2>
        {reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Material</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Unit Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Total Cost</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Employee</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Site</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {transaction.timestamp.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {getMaterialName(transaction.materialId)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'check-in' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {transaction.type === 'check-in' ? 'Check In' : 'Check Out'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{transaction.quantity}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      ${getMaterialCost(transaction.materialId).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                      ${(getMaterialCost(transaction.materialId) * transaction.quantity).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{transaction.user}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {transaction.constructionSite || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No transactions found with current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}