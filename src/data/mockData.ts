import { Category, Subcategory, Material, Transaction, User, ConstructionSite } from '../types/material';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'manager',
    role: 'manager',
    fullName: 'John Manager'
  },
  {
    id: '2',
    username: 'director',
    role: 'director',
    fullName: 'Sarah Director'
  },
  {
    id: '3',
    username: 'employee',
    role: 'employee',
    fullName: 'Mike Employee'
  },
  {
    id: '4',
    username: 'secretary',
    role: 'secretary',
    fullName: 'Lisa Secretary'
  }
];

export const mockConstructionSites: ConstructionSite[] = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    location: '123 Main St, Downtown',
    isActive: true,
    address: undefined
  },
  {
    id: '2',
    name: 'Residential Tower A',
    location: '456 Oak Ave, Westside',
    isActive: true,
    address: undefined
  },
  {
    id: '3',
    name: 'Shopping Mall Extension',
    location: '789 Commerce Blvd, Eastside',
    isActive: true,
    address: undefined
  },
  {
    id: '4',
    name: 'Industrial Warehouse',
    location: '321 Industrial Way, North',
    isActive: false,
    address: undefined
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Concrete & Masonry',
    description: 'Concrete, cement, blocks, and masonry materials',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    subcategoryCount: 0
  },
  {
    id: '2',
    name: 'Steel & Metal',
    description: 'Rebar, structural steel, and metal components',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    subcategoryCount: 0
  },
  {
    id: '3',
    name: 'Lumber & Wood',
    description: 'Dimensional lumber, plywood, and wood products',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    subcategoryCount: 0
  },
  {
    id: '4',
    name: 'Electrical',
    description: 'Wiring, conduits, and electrical components',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    subcategoryCount: 0
  }
];

export const mockSubcategories: Subcategory[] = [
  // Concrete & Masonry subcategories
  {
    id: '1',
    categoryId: '1',
    name: 'Portland Cement',
    description: 'Various types of Portland cement',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  {
    id: '2',
    categoryId: '1',
    name: 'Concrete Blocks',
    description: 'Standard and specialty concrete blocks',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  {
    id: '3',
    categoryId: '1',
    name: 'Aggregates',
    description: 'Sand, gravel, and crushed stone',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  // Steel & Metal subcategories
  {
    id: '4',
    categoryId: '2',
    name: 'Reinforcement Bars',
    description: 'Rebar in various sizes and grades',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  {
    id: '5',
    categoryId: '2',
    name: 'Structural Steel',
    description: 'Beams, columns, and structural components',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  // Lumber & Wood subcategories
  {
    id: '6',
    categoryId: '3',
    name: 'Dimensional Lumber',
    description: 'Standard construction lumber',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  {
    id: '7',
    categoryId: '3',
    name: 'Plywood & Panels',
    description: 'Plywood, OSB, and engineered panels',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  // Electrical subcategories
  {
    id: '8',
    categoryId: '4',
    name: 'Wiring & Cable',
    description: 'Electrical wiring and cables',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  },
  {
    id: '9',
    categoryId: '4',
    name: 'Conduits & Fittings',
    description: 'Electrical conduits and fittings',
    createdAt: new Date('2025-01-01'),
    createdBy: 'manager',
    materialCount: 0
  }
];

export const mockMaterials: Material[] = [
  // Portland Cement materials
  {
    id: '1',
    subcategoryId: '1',
    name: 'Type I Portland Cement',
    description: 'General purpose Portland cement, 94 lb bags',
    unit: 'bags',
    currentStock: 150,
    minStock: 50,
    maxStock: 300,
    unitCost: 12.50,
    supplier: 'LafargeHolcim',
    location: 'Warehouse A - Shelf 1',
    qrCode: 'QR-CEMENT-001',
    lastUpdated: new Date('2025-01-10'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  },
  {
    id: '2',
    subcategoryId: '1',
    name: 'Type III High Early Strength',
    description: 'High early strength Portland cement, 94 lb bags',
    unit: 'bags',
    currentStock: 75,
    minStock: 25,
    maxStock: 150,
    unitCost: 15.25,
    supplier: 'LafargeHolcim',
    location: 'Warehouse A - Shelf 2',
    qrCode: 'QR-CEMENT-002',
    lastUpdated: new Date('2025-01-09'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  },
  // Reinforcement Bars materials
  {
    id: '3',
    subcategoryId: '4',
    name: 'Rebar #4 Grade 60',
    description: '1/2" Grade 60 Rebar, 20ft lengths',
    unit: 'pieces',
    currentStock: 200,
    minStock: 100,
    maxStock: 500,
    unitCost: 12.75,
    supplier: 'Nucor Steel',
    location: 'Yard B - Section 1',
    qrCode: 'QR-REBAR-001',
    lastUpdated: new Date('2025-01-08'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  },
  {
    id: '4',
    subcategoryId: '4',
    name: 'Rebar #5 Grade 60',
    description: '5/8" Grade 60 Rebar, 20ft lengths',
    unit: 'pieces',
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unitCost: 18.75,
    supplier: 'Nucor Steel',
    location: 'Yard B - Section 2',
    qrCode: 'QR-REBAR-002',
    lastUpdated: new Date('2025-01-07'),
    status: 'low-stock',
    createdBy: 'manager',
    category: undefined
  },
  // Dimensional Lumber materials
  {
    id: '5',
    subcategoryId: '6',
    name: '2x4x8 Douglas Fir',
    description: 'Construction grade 2x4x8 Douglas Fir',
    unit: 'pieces',
    currentStock: 300,
    minStock: 150,
    maxStock: 600,
    unitCost: 8.25,
    supplier: 'Weyerhaeuser',
    location: 'Lumber Yard - Stack A',
    qrCode: 'QR-LUMBER-001',
    lastUpdated: new Date('2025-01-06'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  },
  {
    id: '6',
    subcategoryId: '6',
    name: '2x6x10 Douglas Fir',
    description: 'Construction grade 2x6x10 Douglas Fir',
    unit: 'pieces',
    currentStock: 0,
    minStock: 50,
    maxStock: 200,
    unitCost: 15.50,
    supplier: 'Weyerhaeuser',
    location: 'Lumber Yard - Stack B',
    qrCode: 'QR-LUMBER-002',
    lastUpdated: new Date('2025-01-05'),
    status: 'out-of-stock',
    createdBy: 'manager',
    category: undefined
  },
  // Concrete Blocks materials
  {
    id: '7',
    subcategoryId: '2',
    name: '8x8x16 Standard Block',
    description: 'Standard concrete masonry unit',
    unit: 'pieces',
    currentStock: 500,
    minStock: 200,
    maxStock: 1000,
    unitCost: 2.85,
    supplier: 'Oldcastle Materials',
    location: 'Warehouse C - Bay 1',
    qrCode: 'QR-BLOCK-001',
    lastUpdated: new Date('2025-01-04'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  },
  // Wiring materials
  {
    id: '8',
    subcategoryId: '8',
    name: '12 AWG THHN Wire',
    description: '12 gauge THHN solid copper wire, 500ft roll',
    unit: 'rolls',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitCost: 125.00,
    supplier: 'Southwire',
    location: 'Electrical Room - Shelf A',
    qrCode: 'QR-WIRE-001',
    lastUpdated: new Date('2025-01-03'),
    status: 'in-stock',
    createdBy: 'manager',
    category: undefined
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    materialId: '1',
    type: 'check-out',
    quantity: 50,
    reason: 'Foundation pour',
    constructionSite: 'Downtown Office Complex',
    user: 'Mike Employee',
    userRole: 'employee',
    timestamp: new Date('2025-01-10T09:30:00'),
    location: 'Downtown Office Complex'
  },
  {
    id: 't2',
    materialId: '3',
    type: 'check-in',
    quantity: 100,
    reason: 'New delivery from supplier',
    user: 'Lisa Secretary',
    userRole: 'secretary',
    timestamp: new Date('2025-01-09T14:15:00')
  },
  {
    id: 't3',
    materialId: '5',
    type: 'check-out',
    quantity: 75,
    reason: 'Framing work',
    constructionSite: 'Residential Tower A',
    user: 'Mike Employee',
    userRole: 'employee',
    timestamp: new Date('2025-01-08T11:45:00'),
    location: 'Residential Tower A'
  }
];

export const suppliers = [
  'LafargeHolcim',
  'Nucor Steel',
  'Weyerhaeuser',
  'Oldcastle Materials',
  'Martin Marietta',
  'Charlotte Pipe',
  'Home Depot Pro',
  'Ferguson',
  'ABC Supply',
  'BMC Building Materials',
  'Southwire',
  'Electrical Wholesale'
];

export const locations = [
  'Warehouse A - Shelf 1',
  'Warehouse A - Shelf 2',
  'Warehouse B - Shelf 1',
  'Warehouse B - Shelf 2',
  'Warehouse C - Bay 1',
  'Warehouse C - Bay 2',
  'Yard B - Section 1',
  'Yard B - Section 2',
  'Lumber Yard - Stack A',
  'Lumber Yard - Stack B',
  'Electrical Room - Shelf A',
  'Electrical Room - Shelf B',
  'Outdoor Storage Area 1',
  'Outdoor Storage Area 2'
];

export const units = [
  'pieces',
  'bags',
  'tons',
  'cubic yards',
  'linear feet',
  'square feet',
  'gallons',
  'boxes',
  'rolls',
  'sheets',
  'bundles',
  'pallets'
];