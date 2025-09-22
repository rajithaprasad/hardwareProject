import React, { useState, useEffect } from 'react';
import { Plus, Search, QrCode, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
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
import StaffView from './StaffView';
import AddConstructionSiteModal from './AddConstructionSiteModal';
import QuotationView from './QuotationView';
import ReportView from './ReportView';
import NotesView from './NotesView';
import AttendanceView from './AttendanceView';
import EmployeesView from './EmployeesView';
import ToolsView from './ToolsView';
import ConstructionSitesView from './ConstructionSitesView';
import { Category, Material, Transaction, ConstructionSite } from '../types/material';
import { 
  mockCategories, 
  mockMaterials, 
  mockTransactions, 
  mockConstructionSites,
  mockUsers 
} from '../data/mockData';

interface DashboardProps {
  user: { full_name: string; username: string; role: string };
  onLogout: () => void;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('categories');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [constructionSites, setConstructionSites] = useState<ConstructionSite[]>(mockConstructionSites);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showAddConstructionSiteModal, setShowAddConstructionSiteModal] = useState(false);
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

  // Get current user data
  const currentUser = mockUsers.find(u => u.username === user.username);
  const userId = currentUser?.id || '1';

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat${Date.now()}`,
      createdAt: new Date()
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('Category added successfully');
  };

  const handleAddMaterial = async (materialData: Omit<Material, 'id' | 'lastUpdated' | 'status' | 'qrCode' | 'createdBy'> & { createdBy: string }) => {
    const newMaterial: Material = {
      ...materialData,
      id: `mat${Date.now()}`,
      qrCode: `QR-${materialData.name.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`,
      lastUpdated: new Date(),
      status: materialData.currentStock > materialData.minStock ? 'in-stock' : 
              materialData.currentStock > 0 ? 'low-stock' : 'out-of-stock'
    };
    setMaterials(prev => [...prev, newMaterial]);
    toast.success('Material added successfully');
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
    // Update material stock
    setMaterials(prev => prev.map(material => {
      if (material.id === materialId) {
        const newStock = type === 'check-in' 
          ? material.currentStock + quantity 
          : material.currentStock - quantity;
        
        return {
          ...material,
          currentStock: Math.max(0, newStock),
          status: newStock > material.minStock ? 'in-stock' : 
                  newStock > 0 ? 'low-stock' : 'out-of-stock',
          lastUpdated: new Date()
        };
      }
      return material;
    }));

    // Add transaction record
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      materialId,
      type,
      quantity,
      reason,
      constructionSite,
      user: user || user.full_name,
      userRole: userRole || user.role,
      timestamp: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    toast.success(`Material ${type === 'check-in' ? 'added to' : 'withdrawn from'} stock successfully`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        if (selectedCategoryId === categoryId) {
          setSelectedCategoryId(null);
        }
        toast.success('Category deleted successfully');
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
        setMaterials(prev => prev.filter(m => m.id !== materialId));
        if (selectedMaterialId === materialId) {
          setSelectedMaterialId(null);
        }
        toast.success('Material deleted successfully');
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleAddConstructionSite = async (siteData: {
    name: string;
    address: string;
    startDate: string;
    endDate: string;
    siteManager: string;
  }) => {
    const newSite: ConstructionSite = {
      id: `site${Date.now()}`,
      name: siteData.name,
      address: siteData.address,
      isActive: true
    };
    setConstructionSites(prev => [...prev, newSite]);
    toast.success('Construction site added successfully');
  };

  const handleDeleteConstructionSite = async (siteId: string) => {
    setConstructionSites(prev => prev.filter(site => site.id !== siteId));
    toast.success('Construction site deleted successfully');
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
        return <ConstructionSitesView canModify={canModify} />;

      case 'tools':
        return (
          <ToolsView 
            userRole={user.role} 
            userId={userId} 
            userName={user.full_name}
            canModify={canModify}
          />
        );

      case 'employees':
        return (
          <EmployeesView canModify={canModify} />
        );

      case 'notes':
        return (
          <NotesView 
            userRole={user.role} 
            userId={userId} 
            userName={user.full_name} 
          />
        );

      case 'attendance':
        return (
          <AttendanceView 
            userRole={user.role} 
            userId={userId} 
            userName={user.full_name} 
          />
        );

      case 'staff':
        return (
          <StaffView canModify={canModify} />
        );

      case 'quotation':
        return (
          <QuotationView canModify={canModify} />
        );

      case 'report':
        return (
          <ReportView canModify={canModify} />
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
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        userRole={user.role}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-700/30 px-6 py-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              {(selectedCategoryId || selectedMaterialId) && activeSection === 'categories' && (
                <button
                  onClick={() => {
                    if (selectedMaterialId) {
                      setSelectedMaterialId(null);
                    } else {
                      setSelectedCategoryId(null);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
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
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </button>
                  )}
                  {canWithdrawFromStock && (
                    <button
                      onClick={() => setShowQRScanner(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
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
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
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

      {showAddConstructionSiteModal && (
        <AddConstructionSiteModal
          onClose={() => setShowAddConstructionSiteModal(false)}
          onAdd={handleAddConstructionSite}
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