import { ReactNode } from "react";

export interface Category {
  subcategoryCount: number;
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

export interface Subcategory {
  materialCount: number;
  id: string;
  categoryId: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

export interface Material {
  category: ReactNode;
  id: string;
  categoryId: string;
  name: string;
  description: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  supplier?: string;    // Make optional
  location?: string;    // Make optional
  qrCode: string;
  lastUpdated: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdBy: string;
}


export interface Transaction {
  id: string;
  materialId: string;
  type: 'check-in' | 'check-out';
  quantity: number;
  reason: string;
  constructionSite?: string;
  user: string;
  userRole: string;
  timestamp: Date;
  location?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'manager' | 'director' | 'employee' | 'secretary';
  fullName: string;
}

export interface ConstructionSite {
  address: any;
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}