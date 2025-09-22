import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  QrCode,
  Building2,
  Layers,
  Minus,
  History,
  Calendar,
  X,
  Trash2,
  UserPlus,
  Search,
  User,
} from "lucide-react";
import CategoryView from "./CategoryView";
import SubcategoryView from "./SubcategoryView";
import MaterialView from "./MaterialView";
import MaterialDetailView from "./MaterialDetailView";
import AddCategoryModal from "./AddCategoryModal";
import AddSubcategoryModal from "./AddSubcategoryModal";
import AddMaterialModal from "./AddMaterialModal";
import QRScannerModal from "./QRScannerModal";
import ConfirmationModal from "./ConfirmationModal";
import {
  Category,
  Subcategory,
  Material,
  Transaction,
  ConstructionSite,
} from "../types/material";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

interface DashboardProps {
  user: {
    full_name: string;
    username: string;
    role: string;
  };
  onLogout: () => void;
}

type ViewType =
  | "dashboard"
  | "category"
  | "subcategory"
  | "material"
  | "material-detail"
  | "transactions";

type DeleteItemType = "category" | "subcategory" | "material";

interface NavigationState {
  view: ViewType;
  categoryId?: string;
  subcategoryId?: string;
  materialId?: string;
}

const AddUserModal = ({
  onClose,
  onAdd,
  users,
  onDeleteUser,
}: {
  onClose: () => void;
  onAdd: (
    username: string,
    full_name: string,
    password: string,
    role: string
  ) => Promise<void>;
  users: User[];
  onDeleteUser: (id: string) => Promise<void>;
}) => {
  const [username, setUsername] = useState("");
  const [full_name, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !full_name.trim() || !password.trim()) return;
    await onAdd(username, full_name, password, role);
    setUsername("");
    setFullName("");
    setPassword("");
    setRole("employee");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New User
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="secretary">Secretary</option>
                  <option value="director">Director</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>
          </form>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Existing Users
            </h3>
            {users.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No users found
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {user.full_name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.username} • {user.role}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConstructionSiteSettingsModal = ({
  constructionSites,
  onClose,
  onAdd,
  onDelete,
}: {
  constructionSites: ConstructionSite[];
  onClose: () => void;
  onAdd: (name: string, address: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim() || !newSiteAddress.trim()) return;
    await onAdd(newSiteName, newSiteAddress);
    setNewSiteName("");
    setNewSiteAddress("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Construction Sites Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add New Construction Site
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter site name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Enter site address"
                  rows={2}
                  required
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Site
              </button>
            </div>
          </form>
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Existing Sites
            </h3>
            {constructionSites.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No construction sites found
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {constructionSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {site.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {site.address}
                      </p>
                    </div>
                    <button
                      onClick={() => onDelete(site.id)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete site"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionsView = ({
  onClose,
  transactions,
  materials,
}: {
  onClose: () => void;
  transactions: Transaction[];
  materials: Material[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState<"all" | "check-out" | "check-in">("all");

  const getMaterialName = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    return material ? material.name : "Unknown Material";
  };

  const getMaterialUnit = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    return material ? material.unit : "units";
  };

  const getTransactionCost = (materialId: string, quantity: number) => {
    const material = materials.find((m) => m.id === materialId);
    if (!material || !material.unitCost) return 0;
    return material.unitCost * quantity;
  };

  const getTotalCost = () => {
    return filteredTransactions.reduce((total, transaction) => {
      if (transaction.type !== "check-out") return total;
      const material = materials.find((m) => m.id === transaction.materialId);
      if (!material || !material.unitCost) return total;
      return total + material.unitCost * transaction.quantity;
    }, 0);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const materialName = getMaterialName(transaction.materialId).toLowerCase();
    const matchesSearch = materialName.includes(searchTerm.toLowerCase());
    const transactionDate = new Date(transaction.timestamp);
    const matchesStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? transactionDate <= new Date(endDate) : true;
    const matchesType = transactionType === "all" ? true : transaction.type === transactionType;
    return matchesSearch && matchesStartDate && matchesEndDate && matchesType;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Transactions
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by material name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
            </div>
            <div className="flex-1 relative">
              <input
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
            </div>
            <div className="flex-1 relative">
              <input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              />
              <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
            </div>
            <div className="flex-1 relative">
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as "all" | "check-out" | "check-in")}
                className="w-full pl-3 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Transactions</option>
                <option value="check-out">Stock Out</option>
                <option value="check-in">Stock In</option>
              </select>
            </div>
          </div>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                {filteredTransactions
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((transaction) => {
                    const cost = getTransactionCost(transaction.materialId, transaction.quantity);
                    return (
                      <div
                        key={transaction.id}
                        className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                transaction.type === "check-out"
                                  ? "bg-orange-100 dark:bg-orange-900/30"
                                  : "bg-green-100 dark:bg-green-900/30"
                              }`}
                            >
                              {transaction.type === "check-out" ? (
                                <Minus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                              ) : (
                                <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {transaction.type === "check-out" ? "-" : "+"}
                                  {transaction.quantity} {getMaterialUnit(transaction.materialId)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {getMaterialName(transaction.materialId)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {transaction.reason}
                              </p>
                              {transaction.constructionSite && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Building2 className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {transaction.constructionSite}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 mt-1">
                                <User className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.user} ({transaction.userRole})
                                </span>
                              </div>
                              {transaction.type === "check-out" && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Cost: ${cost.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-1">
                              <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              {/* Total Cost Section */}
              <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total Cost for {filteredTransactions.filter(t => t.type === "check-out").length} Stock Out Transactions:
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    ${getTotalCost().toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [constructionSites, setConstructionSites] = useState<
    ConstructionSite[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [zeroStockMaterials, setZeroStockMaterials] = useState<Material[]>([]);
  const [navigation, setNavigation] = useState<NavigationState>({
    view: "dashboard",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showConstructionSiteSettings, setShowConstructionSiteSettings] =
    useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransactionsView, setShowTransactionsView] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: DeleteItemType | "user" | "constructionSite";
    id: string;
  } | null>(null);

  const canModifyEverything = user.role === "manager";
  const canAddToStock = user.role === "manager" || user.role === "secretary";
  const canWithdrawFromStock =
    user.role === "manager" ||
    user.role === "director" ||
    user.role === "employee";
  const isEmployee = user.role === "employee";

  useEffect(() => {
    fetchCategories();
    fetchConstructionSites();
    fetchAllMaterials();
    fetchTransactions();
    fetchUsers();
    fetchZeroStockMaterials();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/users.php"
    );
    const data = await response.json();
    setUsers(data);
  };

  const fetchAllMaterials = async () => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php"
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated),
      createdAt: new Date(item.createdAt),
      unitCost: Number(item.unitCost),
    }));
    setMaterials(mappedData);
  };

  const fetchZeroStockMaterials = async () => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/zero_stock_materials.php"
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      currentStock: Number(item.currentStock),
      lastUpdated: new Date(item.lastUpdated),
      createdAt: new Date(item.createdAt),
      unitCost: Number(item.unitCost),
    }));
    setZeroStockMaterials(mappedData);
  };

  useEffect(() => {
    if (navigation.categoryId) {
      fetchSubcategories(navigation.categoryId);
    }
  }, [navigation.categoryId]);

  useEffect(() => {
    if (navigation.subcategoryId) {
      fetchMaterials(navigation.subcategoryId);
    }
  }, [navigation.subcategoryId]);

  useEffect(() => {
    if (navigation.materialId) {
      fetchTransactions(navigation.materialId);
    } else {
      fetchTransactions();
    }
  }, [navigation.materialId]);

  const fetchCategories = async () => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/categories.php"
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
    setCategories(mappedData);
  };

  const fetchSubcategories = async (categoryId: string) => {
    const response = await fetch(
      `https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/subcategories.php?categoryId=${categoryId}`
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
    setSubcategories(mappedData);
  };

  const fetchMaterials = async (subcategoryId: string) => {
    const response = await fetch(
      `https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php?subcategoryId=${subcategoryId}`
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated),
      createdAt: new Date(item.createdAt),
      unitCost: Number(item.unitCost),
    }));
    setMaterials(mappedData);
  };

  const fetchTransactions = async (materialId?: string) => {
    let url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/transactions.php";
    if (materialId) {
      url += `?materialId=${materialId}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      id: item.id,
      materialId: item.materialId,
      type: item.type,
      quantity: Number(item.quantity),
      reason: item.reason,
      constructionSite: item.constructionSite,
      user: item.user,
      userRole: item.userRole,
      timestamp: new Date(item.timestamp),
    }));
    setTransactions(mappedData);
  };

  const fetchConstructionSites = async () => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/construction_sites.php"
    );
    const data = await response.json();
    const mappedData = data.map((item: any) => ({
      ...item,
      isActive: !!item.isActive,
      location: item.location || "",
    }));
    setConstructionSites(mappedData);
  };

  const handleAddCategory = async (
    newCategory: Omit<Category, "id" | "createdAt">
  ) => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/categories.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCategory, createdBy: user.username }),
      }
    );
    const { id } = await response.json();
    setCategories((prev) => [
      ...prev,
      { ...newCategory, id, createdAt: new Date() },
    ]);
  };

  const handleAddSubcategory = async (
    newSubcategory: Omit<Subcategory, "id" | "createdAt">
  ) => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/subcategories.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSubcategory, createdBy: user.username }),
      }
    );
    const { id } = await response.json();
    setSubcategories((prev) => [
      ...prev,
      { ...newSubcategory, id, createdAt: new Date() },
    ]);
    await fetchCategories();
  };

  const handleAddMaterial = async (
    newMaterial: Omit<
      Material,
      "id" | "lastUpdated" | "status" | "qrCode" | "createdAt" | "createdBy"
    >
  ) => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMaterial,
          maxStock: 1000,
          supplier: "",
          location: "",
          createdBy: user.username,
        }),
      }
    );
    const { id } = await response.json();
    const status =
      newMaterial.currentStock === 0
        ? "out-of-stock"
        : newMaterial.currentStock <= newMaterial.minStock
        ? "low-stock"
        : "in-stock";
    const qrCode = `QR-${newMaterial.name
      .toUpperCase()
      .replace(/\s+/g, "-")}-${Date.now().toString().slice(-3)}`;
    setMaterials((prev) => [
      ...prev,
      {
        ...newMaterial,
        id,
        qrCode,
        status,
        lastUpdated: new Date(),
        createdAt: new Date(),
        maxStock: 1000,
        supplier: "",
        location: "",
        createdBy: user.username,
      },
    ]);
  };

  const handleTransaction = async (
    materialId: string,
    type: "check-in" | "check-out",
    quantity: number,
    reason: string,
    constructionSite?: string,
    userParam?: string,
    userRoleParam?: string
  ) => {
    try {
      const response = await fetch(
        "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/transactions.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materialId,
            type,
            quantity,
            reason,
            constructionSite,
            user: userParam || user.full_name,
            userRole: userRoleParam || user.role,
          }),
        }
      );
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(
            "Failed to record transaction: Invalid server response"
          );
        }
        throw new Error(errorData.error || "Failed to record transaction");
      }
      const result = await response.json();
      if (!result.id || typeof result.newStock === "undefined") {
        throw new Error("Invalid transaction response from server");
      }
      const { id, newStock } = result;
      const newTransaction = {
        id,
        materialId,
        type,
        quantity,
        reason,
        constructionSite,
        user: userParam || user.full_name,
        userRole: userRoleParam || user.role,
        timestamp: new Date(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      setMaterials((prev) =>
        prev.map((material) => {
          if (material.id === materialId) {
            const newStatus =
              newStock === 0
                ? "out-of-stock"
                : newStock <= material.minStock
                ? "low-stock"
                : "in-stock";
            return {
              ...material,
              currentStock: newStock,
              status: newStatus,
              lastUpdated: new Date(),
            };
          }
          return material;
        })
      );
      toast.success("Transaction recorded successfully!");
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process transaction. Please try again."
      );
    }
  };

  const confirmDeleteItem = (
    type: DeleteItemType | "user" | "constructionSite",
    id: string
  ) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirm(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      const { type, id } = itemToDelete;
      let url = "";
      if (type === "category") {
        url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/categories.php";
      } else if (type === "subcategory") {
        url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/subcategories.php";
      } else if (type === "material") {
        url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/materials.php";
      } else if (type === "user") {
        url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/users.php";
      } else if (type === "constructionSite") {
        url = "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/construction_sites.php";
      }
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        if (type === "category") {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
          toast.success("Category deleted successfully!");
        } else if (type === "subcategory") {
          setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
          toast.success("Subcategory deleted successfully!");
          if (navigation.categoryId) {
            fetchSubcategories(navigation.categoryId);
          }
        } else if (type === "material") {
          setMaterials((prev) => prev.filter((mat) => mat.id !== id));
          toast.success("Material deleted successfully!");
          if (navigation.subcategoryId) {
            fetchMaterials(navigation.subcategoryId);
          }
        } else if (type === "user") {
          setUsers((prev) => prev.filter((user) => user.id !== id));
          toast.success("User deleted successfully!");
        } else if (type === "constructionSite") {
          setConstructionSites((prev) => prev.filter((site) => site.id !== id));
          toast.success("Construction site deleted successfully!");
        }
      } else {
        toast.error(`Failed to delete ${type}.`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      toast.error(`Error deleting ${itemToDelete.type}.`);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleAddConstructionSite = async (name: string, address: string) => {
    const response = await fetch(
      "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/construction_sites.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          createdBy: user.username,
          location: "",
        }),
      }
    );
    const { id } = await response.json();
    setConstructionSites((prev) => [
      ...prev,
      { id, name, address, isActive: true, location: "" },
    ]);
  };

  const handleDeleteConstructionSite = async (id: string) => {
    confirmDeleteItem("constructionSite", id);
  };

  const handleAddUser = async (
    username: string,
    full_name: string,
    password: string,
    role: string
  ) => {
    try {
      const response = await fetch(
        "https://deepskyblue-chinchilla-933370.hostingersite.com/hardware_system_backend/users.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, full_name, password, role }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add user");
      }
      const { id } = await response.json();
      setUsers((prev) => [...prev, { id, username, full_name, role }]);
      toast.success("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add user"
      );
    }
  };

  const handleDeleteUser = async (id: string) => {
    confirmDeleteItem("user", id);
  };

  const getCurrentCategory = () =>
    categories.find((c) => c.id === navigation.categoryId);
  const getCurrentSubcategory = () =>
    subcategories.find((s) => s.id === navigation.subcategoryId);
  const getCurrentMaterial = () =>
    materials.find((m) => m.id === navigation.materialId);

  const totalMaterials = materials.length;
  const inStockCount = materials.filter((m) => m.status === "in-stock").length;
  const lowStockCount = materials.filter(
    (m) => m.status === "low-stock"
  ).length;
  const outOfStockCount = materials.filter(
    (m) => m.status === "out-of-stock"
  ).length;
  const totalCategories = categories.length;

  const renderBreadcrumb = () => {
    const items = [
      {
        label: "Dashboard",
        onClick: () => setNavigation({ view: "dashboard" }),
      },
    ];
    if (navigation.categoryId) {
      const category = getCurrentCategory();
      items.push({
        label: category?.name || "Category",
        onClick: () =>
          setNavigation({
            view: "category",
            categoryId: navigation.categoryId,
          }),
      });
    }
    if (navigation.subcategoryId) {
      const subcategory = getCurrentSubcategory();
      items.push({
        label: subcategory?.name || "Subcategory",
        onClick: () =>
          setNavigation({
            view: "subcategory",
            categoryId: navigation.categoryId,
            subcategoryId: navigation.subcategoryId,
          }),
      });
    }
    if (navigation.materialId) {
      const material = getCurrentMaterial();
      items.push({ label: material?.name || "Material", onClick: () => {} });
    }
    return (
      <nav className="flex items-center gap-2 mb-6">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <button
              onClick={item.onClick}
              className={`text-sm font-medium transition-colors ${
                index === items.length - 1
                  ? "text-gray-900 dark:text-white cursor-default"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
            {index < items.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {isEmployee && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Material Withdrawal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Scan QR code to withdraw materials
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
            >
              <QrCode className="w-8 h-8" />
              Scan QR Code
            </button>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                My Transactions
              </h3>
            </div>
            {transactions.filter((t) => t.user === user.full_name).length >
            0 ? (
              <div className="space-y-4">
                {transactions
                  .filter((t) => t.user === user.full_name)
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 10)
                  .map((transaction) => {
                    const material = materials.find(
                      (m) => m.id === transaction.materialId
                    );
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                            {transaction.type === "check-out" ? (
                              <Minus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            ) : (
                              <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {transaction.type === "check-out" ? "-" : "+"}
                                {transaction.quantity}{" "}
                                {material?.unit || "units"}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {material?.name || "Unknown Material"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.reason}
                            </p>
                            {transaction.constructionSite && (
                              <div className="flex items-center gap-1 mt-1">
                                <Building2 className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.constructionSite}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {transaction.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span>
                              {transaction.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No transactions yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {!isEmployee && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalCategories}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Layers className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Total Materials
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {totalMaterials}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    In Stock
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {inStockCount}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Low/Out Stock
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {lowStockCount + outOfStockCount}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Zero-Stock Materials
              </h3>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">
                  {zeroStockMaterials.length} items
                </span>
              </div>
            </div>
            {zeroStockMaterials.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {zeroStockMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {material.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {material.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                            {material.currentStock} {material.unit}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Min: {material.minStock} {material.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No zero-stock materials found
                </p>
              </div>
            )}
          </div>
          {canModifyEverything && (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
              <button
                onClick={() => setShowAddSubcategoryModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add Subcategory
              </button>
              <button
                onClick={() => setShowAddMaterialModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add Material
              </button>
              <button
                onClick={() => setShowConstructionSiteSettings(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Building2 className="w-5 h-5" />
                Manage Sites
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" />
                Manage Users
              </button>
              <button
                onClick={() => setShowTransactionsView(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <History className="w-5 h-5" />
                View All Transactions
              </button>
            </div>
          )}
          <CategoryView
            categories={categories}
            onCategoryClick={(categoryId) =>
              setNavigation({ view: "category", categoryId })
            }
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDeleteCategory={(categoryId) =>
              confirmDeleteItem("category", categoryId)
            }
          />
        </>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <Toaster position="top-right" reverseOrder={false} />
      {renderBreadcrumb()}
      {navigation.view === "dashboard" && renderDashboard()}
      {navigation.view === "category" && navigation.categoryId && (
        <SubcategoryView
          category={getCurrentCategory()!}
          subcategories={subcategories.filter(
            (s) => s.categoryId === navigation.categoryId
          )}
          onSubcategoryClick={(subcategoryId) =>
            setNavigation({
              view: "subcategory",
              categoryId: navigation.categoryId,
              subcategoryId,
            })
          }
          canModify={canModifyEverything}
          onAddSubcategory={() => setShowAddSubcategoryModal(true)}
          onDeleteSubcategory={(subcategoryId) =>
            confirmDeleteItem("subcategory", subcategoryId)
          }
        />
      )}
      {navigation.view === "subcategory" && navigation.subcategoryId && (
        <MaterialView
          subcategory={getCurrentSubcategory()!}
          materials={materials.filter(
            (m) => m.subcategoryId === navigation.subcategoryId
          )}
          onMaterialClick={(materialId) =>
            setNavigation({
              view: "material-detail",
              categoryId: navigation.categoryId,
              subcategoryId: navigation.subcategoryId,
              materialId,
            })
          }
          canModify={canModifyEverything}
          onAddMaterial={() => setShowAddMaterialModal(true)}
          onDeleteMaterial={(materialId) =>
            confirmDeleteItem("material", materialId)
          }
        />
      )}
      {navigation.view === "material-detail" && navigation.materialId && (
        <MaterialDetailView
          material={getCurrentMaterial()!}
          transactions={transactions.filter(
            (t) => t.materialId === navigation.materialId
          )}
          constructionSites={constructionSites}
          onTransaction={handleTransaction}
          canAddToStock={canAddToStock}
          canWithdrawFromStock={canWithdrawFromStock}
          userRole={user.role}
          userFullName={user.full_name}
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
      {showAddCategoryModal && !isEmployee && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={handleAddCategory}
          createdBy={user.username}
        />
      )}
      {showAddSubcategoryModal && !isEmployee && (
        <AddSubcategoryModal
          categories={categories}
          selectedCategoryId={navigation.categoryId}
          onClose={() => setShowAddSubcategoryModal(false)}
          onAdd={handleAddSubcategory}
          createdBy={user.username}
        />
      )}
      {showAddMaterialModal && !isEmployee && (
        <AddMaterialModal
          categories={categories}
          subcategories={subcategories}
          onClose={() => setShowAddMaterialModal(false)}
          onAdd={handleAddMaterial}
          createdBy={user.username}
        />
      )}
      {showConstructionSiteSettings && (
        <ConstructionSiteSettingsModal
          constructionSites={constructionSites}
          onClose={() => setShowConstructionSiteSettings(false)}
          onAdd={handleAddConstructionSite}
          onDelete={handleDeleteConstructionSite}
        />
      )}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAdd={handleAddUser}
          users={users}
          onDeleteUser={handleDeleteUser}
        />
      )}
      {showTransactionsView && (
        <TransactionsView
          onClose={() => setShowTransactionsView(false)}
          transactions={transactions}
          materials={materials}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteItem}
          title={`Delete ${itemToDelete?.type}`}
          message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
