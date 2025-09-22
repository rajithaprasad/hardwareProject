import { useState, useEffect } from 'react';
import { X, QrCode, Package, MapPin, AlertTriangle, Minus, Camera } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Material, ConstructionSite } from '../types/material';

interface QRScannerModalProps {
  onClose: () => void;
  onTransaction: (
    materialId: string,
    type: 'check-out',
    quantity: number,
    reason: string,
    constructionSite?: string,
    user?: string,
    userRole?: string
  ) => void;
  userFullName: string;
  userRole: string;
}

export default function QRScannerModal({
  onClose,
  onTransaction,
  userFullName,
  userRole,
}: QRScannerModalProps) {
  const [qrCode, setQrCode] = useState('');
  const [scannedMaterial, setScannedMaterial] = useState<Material | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [constructionSite, setConstructionSite] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'scan' | 'confirm' | 'withdraw'>('scan');
  const [useCamera, setUseCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [constructionSites, setConstructionSites] = useState<ConstructionSite[]>([]);

  // Fetch construction sites when modal opens
  useEffect(() => {
    const fetchConstructionSites = async () => {
      try {
        const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/hardware_system_backend/construction_sites.php');
        const data = await response.json();
        setConstructionSites(data);
      } catch (error) {
        console.error('Error fetching construction sites:', error);
      }
    };
    fetchConstructionSites();
  }, []);

  const handleQRScan = async () => {
    if (!qrCode.trim()) return;
   
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/get_material_by_qr.php?qrCode=${encodeURIComponent(qrCode.trim())}`
      );
      const data = await response.json();
      if (response.ok) {
        setScannedMaterial(data);
        setStep('confirm');
      } else {
        alert(data.error || 'Material not found. Please check the QR code.');
      }
    } catch (error) {
      console.error('Error fetching material:', error);
      alert('Failed to fetch material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setQrCode(result);
      setUseCamera(false);
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/hardware_system_backend/get_material_by_qr.php?qrCode=${encodeURIComponent(result.trim())}`
        );
        const data = await response.json();
        if (response.ok) {
          setScannedMaterial(data);
          setStep('confirm');
        } else {
          alert(data.error || 'Material not found. Please check the QR code.');
        }
      } catch (error) {
        console.error('Error fetching material:', error);
        alert('Failed to fetch material. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleError = (error: unknown) => {
    console.error(error);
  };

  const handleWithdraw = () => {
    if (scannedMaterial && quantity > 0 && constructionSite && reason.trim()) {
      onTransaction(
        scannedMaterial.id,
        'check-out',
        quantity,
        reason.trim(),
        constructionSite,
        userFullName,
        userRole
      );
      onClose();
    }
  };

  const maxQuantity = scannedMaterial?.currentStock || 0;
  const isValidQuantity = quantity > 0 && quantity <= maxQuantity;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {step === 'scan' && 'Scan QR Code'}
                {step === 'confirm' && 'Material Found'}
                {step === 'withdraw' && 'Withdraw Material'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step === 'scan' && 'Enter or scan the QR code'}
                {step === 'confirm' && 'Confirm material details'}
                {step === 'withdraw' && 'Enter withdrawal details'}
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

        <div className="p-6">
          {/* Step 1: QR Code Input/Scan */}
          {step === 'scan' && (
            <div className="space-y-6">
              {!useCamera ? (
                <>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Scan the QR code on the material shelf or enter it manually
                    </p>
                  </div>
                  <div>
                    <label htmlFor="qrCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      QR Code *
                    </label>
                    <input
                      type="text"
                      id="qrCode"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Enter QR code (e.g., QR-CEMENT-001)"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => setUseCamera(true)}
                    className="w-full px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Use Camera
                  </button>
                  <button
                    onClick={handleQRScan}
                    disabled={!qrCode.trim() || isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    {isLoading ? 'Scanning...' : 'Scan Material'}
                  </button>
                </>
              ) : (
                <div className="relative w-full h-64 rounded-xl overflow-hidden">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    styles={{
                      container: { width: '100%', height: '100%' },
                      video: { borderRadius: '0.75rem' },
                    }}
                  />
                  <button
                    onClick={() => setUseCamera(false)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg"
                  >
                    <X className="w-5 h-5 text-gray-900 dark:text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Material Confirmation */}
          {step === 'confirm' && scannedMaterial && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {scannedMaterial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {scannedMaterial.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {scannedMaterial.currentStock} {scannedMaterial.unit} available
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {scannedMaterial.location}
                        </span>
                      </div>
                    </div>
                    {scannedMaterial.currentStock === 0 && (
                      <div className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Out of stock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep('scan');
                    setUseCamera(false);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('withdraw')}
                  disabled={scannedMaterial.currentStock === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  Withdraw
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Withdrawal Details */}
          {step === 'withdraw' && scannedMaterial && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {scannedMaterial.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {scannedMaterial.currentStock} {scannedMaterial.unit} available
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to withdraw ({scannedMaterial.unit}) *
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  max={maxQuantity}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
                />
                {!isValidQuantity && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                    Enter a valid quantity (1-{maxQuantity})
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="constructionSite" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Construction Site *
                </label>
                <select
                  id="constructionSite"
                  value={constructionSite}
                  onChange={(e) => setConstructionSite(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Select construction site...</option>
                  {constructionSites.map(site => (
                    <option key={site.id} value={site.name}>{site.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Reason *
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Foundation pour, framing work, etc."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('confirm')}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!isValidQuantity || !constructionSite || !reason.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Minus className="w-4 h-4" />
                    Withdraw
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
