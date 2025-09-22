import React, { useState, useEffect } from 'react';
import { Plus, Search, QrCode, Building2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import CategoryView from './CategoryView';
import MaterialView from './MaterialView';
import MaterialDetailView from './MaterialDetailView';
import AddCategoryModal from './AddCategoryModal';
import AddMaterialModal from './AddMaterialModal';
import TransactionModal from './TransactionModal';
import QRScannerModal from './QRScannerModal';
import ConstructionSiteSettingsModal from './ConstructionSiteSettingsModal';
import ConfirmationModal from './ConfirmationModal';
import { Category, Material, Transaction, ConstructionSite } from '../types/material';

interface DashboardProps {
  user: { full_name: string; username: string; role: string };
  onLogout: () => void;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [constructionSites, setConstructionSites] = useState<ConstructionSite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConstructionSiteModal, setShowConstructionSiteModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const canModify = ['manager', 'director'].includes(user.role);
  const canAddToStock = ['manager', 'director', 'secretary'].includes(user.role);
  const canWithdrawFromStock = ['manager', 'director', 'employee'].includes(user.role);

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
    fetchMaterials();
    fetchTransactions();
    fetchConstructionSites();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/categories.php');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to fetch materials');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/transactions.php');
      const data = await response.json();
      setTransactions(data.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      })));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  const fetchConstructionSites = async () => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/construction_sites.php');
      const data = await response.json();
      setConstructionSites(data);
    } catch (error) {
      console.error('Error fetching construction sites:', error);
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/add_category.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Category added successfully');
        fetchCategories();
      } else {
        toast.error(result.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddMaterial = async (materialData: Omit<Material, 'id' | 'lastUpdated' | 'status' | 'qrCode' | 'createdBy'> & { createdBy: string }) => {
    try {
      // Use a default subcategory ID since we're removing subcategories
      const dataWithSubcategory = {
        ...materialData,
        subcategoryId: 'default-subcategory'
      };
      
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/add_material.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithSubcategory),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Material added successfully');
        fetchMaterials();
      } else {
        toast.error(result.message || 'Failed to add material');
      }
    } catch (error) {
      console.error('Error adding material:', error);
      toast.error('Failed to add material');
    }
  };

  const handleTransaction = async (
    materialId: string,
    type: 'check-in' | 'check-out',
    quantity: number,
    reason: string,
    constructionSite?: string,
    user?: string,
    userRole?: string
  ) => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/transaction.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId,
          type,
          quantity,
          reason,
          constructionSite,
          user: user || user.full_name,
          userRole: userRole || user.role,
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(`Material ${type === 'check-in' ? 'added to' : 'withdrawn from'} stock successfully`);
        fetchMaterials();
        fetchTransactions();
      } else {
        toast.error(result.message || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Transaction failed');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/delete_category.php?id=${categoryId}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
            toast.success('Category deleted successfully');
            fetchCategories();
            if (selectedCategoryId === categoryId) {
              setSelectedCategoryId(null);
            }
          } else {
            toast.error(result.message || 'Failed to delete category');
          }
        } catch (error) {
          console.error('Error deleting category:', error);
          toast.error('Failed to delete category');
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteMaterial = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Material',
      message: `Are you sure you want to delete "${material.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/delete_material.php?id=${materialId}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
            toast.success('Material deleted successfully');
            fetchMaterials();
            if (selectedMaterialId === materialId) {
              setSelectedMaterialId(null);
            }
          } else {
            toast.error(result.message || 'Failed to delete material');
          }
        } catch (error) {
          console.error('Error deleting material:', error);
          toast.error('Failed to delete material');
        }
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleAddConstructionSite = async (name: string, address: string) => {
    try {
      const response = await fetch('https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/add_construction_site.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Construction site added successfully');
        fetchConstructionSites();
      } else {
        toast.error(result.message || 'Failed to add construction site');
      }
    } catch (error) {
      console.error('Error adding construction site:', error);
      toast.error('Failed to add construction site');
    }
  };

  const handleDeleteConstructionSite = async (siteId: string) => {
    try {
      const response = await fetch(`https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/delete_construction_site.php?id=${siteId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Construction site deleted successfully');
        fetchConstructionSites();
      } else {
        toast.error(result.message || 'Failed to delete construction site');
      }
    } catch (error) {
      console.error('Error deleting construction site:', error);
      toast.error('Failed to delete construction site');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'categories':
        if (selectedMaterialId) {
          const material = materials.find(m => m.id === selectedMaterialId);
          if (material) {
            const materialTransactions = transactions.filter(t => t.materialId === selectedMaterialId);
            return (
              <MaterialDetailView
                material={material}
                transactions={materialTransactions}
                constructionSites={constructionSites}
                onTransaction={handleTransaction}
                canAddToStock={canAddToStock}
                canWithdrawFromStock={canWithdrawFromStock}
                userRole={user.role}
                userFullName={user.full_name}
              />
            );
          }
        }

        if (selectedCategoryId) {
          const category = categories.find(c => c.id === selectedCategoryId);
          const categoryMaterials = materials.filter(m => m.categoryId === selectedCategoryId);
          
          if (category) {
            return (
              <MaterialView
                category={category}
                materials={categoryMaterials}
                onMaterialClick={setSelectedMaterialId}
                canModify={canModify}
                onAddMaterial={() => setShowAddMaterialModal(true)}
                onDeleteMaterial={handleDeleteMaterial}
              />
            );
          }
        }

        return (
          <CategoryView
            categories={categories}
            onCategoryClick={setSelectedCategoryId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDeleteCategory={handleDeleteCategory}
          />
        );

      case 'construction-sites':
        return (
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Construction Sites</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage construction site locations</p>
                  </div>
                </div>
                {canModify && (
                  <button
                    onClick={() => setShowConstructionSiteModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    Manage Sites
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {constructionSites.map(site => (
                  <div key={site.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{site.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{site.address}</p>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                      site.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {site.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Employees</h1>
            <p className="text-gray-600 dark:text-gray-400">Employee management coming soon...</p>
          </div>
        );

      case 'notes':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notes</h1>
            <p className="text-gray-600 dark:text-gray-400">Notes management coming soon...</p>
          </div>
        );

      case 'quotation':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quotation</h1>
            <p className="text-gray-600 dark:text-gray-400">Quotation management coming soon...</p>
          </div>
        );

      case 'report':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Report generation coming soon...</p>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">System settings coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(selectedCategoryId || selectedMaterialId) && activeSection === 'categories' && (
                <button
                  onClick={() => {
                    if (selectedMaterialId) {
                      setSelectedMaterialId(null);
                    } else {
                      setSelectedCategoryId(null);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {activeSection === 'categories' && !selectedCategoryId && !selectedMaterialId && (
                <>
                  {canModify && (
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </button>
                  )}
                  {canWithdrawFromStock && (
                    <button
                      onClick={() => setShowQRScanner(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Scanner
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={handleAddCategory}
          createdBy={user.username}
        />
      )}

      {showAddMaterialModal && selectedCategoryId && (
        <AddMaterialModal
          categories={categories}
          subcategories={[]} // Empty since we're removing subcategories
          selectedCategoryId={selectedCategoryId}
          onClose={() => setShowAddMaterialModal(false)}
          onAdd={handleAddMaterial}
          createdBy={user.username}
        />
      )}

      {showQRScanner && (
        <QRScannerModal
          onClose={() => setShowQRScanner(false)}
          onTransaction={handleTransaction}
          userFullName={user.full_name}
          userRole={user.role}
        />
      )}

      {showConstructionSiteModal && (
        <ConstructionSiteSettingsModal
          constructionSites={constructionSites}
          onClose={() => setShowConstructionSiteModal(false)}
          onAdd={handleAddConstructionSite}
          onDelete={handleDeleteConstructionSite}
        />
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </div>
  );
}