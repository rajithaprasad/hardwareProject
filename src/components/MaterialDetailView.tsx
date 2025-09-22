import { useState } from 'react';
import {
  Package,
  MapPin,
  Truck,
  DollarSign,
  Plus,
  Minus,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  History,
  ArrowDownToLine
} from 'lucide-react';
import { Material, Transaction, ConstructionSite } from '../types/material';
import TransactionModal from './TransactionModal';
import { toast } from 'react-hot-toast';

interface MaterialDetailViewProps {
  material: Material;
  transactions: Transaction[];
  constructionSites: ConstructionSite[];
  onTransaction: (
    materialId: string,
    type: 'check-in' | 'check-out',
    quantity: number,
    reason: string,
    constructionSite?: string,
    user?: string,
    userRole?: string
  ) => void;
  canAddToStock: boolean;
  canWithdrawFromStock: boolean;
  userRole: string;
  userFullName: string;
}

export default function MaterialDetailView({
  material,
  transactions,
  constructionSites,
  onTransaction,
  canAddToStock,
  canWithdrawFromStock,
  userRole,
  userFullName,
}: MaterialDetailViewProps) {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'check-in' | 'check-out'>('check-in');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getStockPercentage = () => {
    return Math.min((material.currentStock / material.maxStock) * 100, 100);
  };

  const stockPercentage = getStockPercentage();

  const handleTransactionClick = (type: 'check-in' | 'check-out') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const handleDownloadQRCode = async () => {
    try {
      const qrCodeUrl = generateQRCode(material.qrCode);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${material.qrCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Failed to download QR code.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Material Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{material.name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(material.status)}`}>
                  {material.status === 'in-stock' && 'In Stock'}
                  {material.status === 'low-stock' && 'Low Stock'}
                  {material.status === 'out-of-stock' && 'Out of Stock'}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{material.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Updated {material.lastUpdated.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          {/* QR Code */}
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg p-2 mb-2 relative group">
              <img
                src={generateQRCode(material.qrCode)}
                alt={`QR Code for ${material.name}`}
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleDownloadQRCode}
                className="absolute -bottom-2 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                title="Download QR Code"
              >
                <ArrowDownToLine className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{material.qrCode}</p>
          </div>
        </div>
        {/* Stock Level */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Stock Level</span>
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
              {material.currentStock} / {material.maxStock} {material.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                stockPercentage > 50 ? 'bg-green-500' :
                stockPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
          {material.currentStock <= material.minStock && material.currentStock > 0 && (
            <div className="flex items-center gap-2 mt-3 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Below minimum stock level ({material.minStock} {material.unit})</span>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4">
          {canAddToStock && (
            <button
              onClick={() => handleTransactionClick('check-in')}
              className="flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl transition-all duration-200 font-semibold border border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add to Stock
            </button>
          )}
          {canWithdrawFromStock && (
            <button
              onClick={() => handleTransactionClick('check-out')}
              disabled={material.currentStock === 0}
              className="flex items-center gap-2 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl transition-all duration-200 font-semibold border border-orange-200 dark:border-orange-800 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-200 dark:disabled:border-slate-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <Minus className="w-5 h-5" />
              Withdraw from Stock
            </button>
          )}
        </div>
      </div>
      {/* Transaction History */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'check-in'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    {transaction.type === 'check-in' ? (
                      <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Minus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {transaction.type === 'check-in' ? '+' : '-'}{transaction.quantity} {material.unit}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.type === 'check-in' ? 'Added to stock' : 'Withdrawn from stock'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.reason}</p>
                    {transaction.constructionSite && (
                      <div className="flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{transaction.constructionSite}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{transaction.user}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No transactions recorded yet</p>
          </div>
        )}
      </div>
      {/* Transaction Modal */}
      {showTransactionModal && (
        <TransactionModal
          material={material}
          type={transactionType}
          constructionSites={constructionSites}
          onClose={() => setShowTransactionModal(false)}
          onTransaction={onTransaction}
          user={userFullName}
          userRole={userRole}
        />
      )}
    </div>
  );
}
