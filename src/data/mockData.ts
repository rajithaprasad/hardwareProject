import { Category, Material, Transaction, User, ConstructionSite } from '../types/material';

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
    username: 'employee1',
    role: 'employee',
    fullName: 'Mike Johnson'
  },
  {
    id: '4',
    username: 'employee2',
    role: 'employee',
    fullName: 'Lisa Smith'
  },
  {
    id: '5',
    username: 'employee3',
    role: 'employee',
    fullName: 'David Wilson'
  },
  {
    id: '6',
    username: 'secretary',
    role: 'secretary',
    fullName: 'Anna Secretary'
  }
];

export const mockConstructionSites: ConstructionSite[] = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    address: '123 Main St, Downtown',
    isActive: true
  },
  {
    id: '2',
    name: 'Residential Tower A',
    address: '456 Oak Ave, Westside',
    isActive: true
  },
  {
    id: '3',
    name: 'Shopping Mall Extension',
    address: '789 Commerce Blvd, Eastside',
    isActive: true
  },
  {
    id: '4',
    name: 'Industrial Warehouse',
    address: '321 Industrial Way, North',
    isActive: false
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

export const mockMaterials: Material[] = [
  {
    id: '1',
    categoryId: '1',
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
    categoryId: '1',
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
  {
    id: '3',
    categoryId: '2',
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
    categoryId: '2',
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
  {
    id: '5',
    categoryId: '3',
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
    categoryId: '3',
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
  {
    id: '7',
    categoryId: '1',
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
  {
    id: '8',
    categoryId: '4',
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
    user: 'Mike Johnson',
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
    user: 'Anna Secretary',
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
    user: 'Lisa Smith',
    userRole: 'employee',
    timestamp: new Date('2025-01-08T11:45:00'),
    location: 'Residential Tower A'
  }
];

// New interfaces for notes and attendance
export interface Note {
  id: string;
  employeeId: string;
  employeeName: string;
  constructionSiteId: string;
  constructionSiteName: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  constructionSiteId: string;
  constructionSiteName: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  status: 'present' | 'absent' | 'in-progress';
  totalHours?: number;
}

export const mockNotes: Note[] = [
  {
    id: 'n1',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    constructionSiteId: '1',
    constructionSiteName: 'Downtown Office Complex',
    title: 'Foundation Issues',
    content: 'Found some cracks in the foundation that need immediate attention. Contacted supervisor.',
    createdAt: new Date('2025-01-10T10:30:00')
  },
  {
    id: 'n2',
    employeeId: '4',
    employeeName: 'Lisa Smith',
    constructionSiteId: '2',
    constructionSiteName: 'Residential Tower A',
    title: 'Material Shortage',
    content: 'Running low on 2x4 lumber. Need to order more for next week.',
    createdAt: new Date('2025-01-09T15:20:00')
  },
  {
    id: 'n3',
    employeeId: '5',
    employeeName: 'David Wilson',
    constructionSiteId: '3',
    constructionSiteName: 'Shopping Mall Extension',
    title: 'Safety Concern',
    content: 'Noticed loose scaffolding on the east side. Reported to safety officer.',
    imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2025-01-08T09:15:00')
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'a1',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    constructionSiteId: '1',
    constructionSiteName: 'Downtown Office Complex',
    date: new Date('2025-01-10'),
    startTime: new Date('2025-01-10T08:00:00'),
    endTime: new Date('2025-01-10T17:00:00'),
    status: 'present',
    totalHours: 9
  },
  {
    id: 'a2',
    employeeId: '4',
    employeeName: 'Lisa Smith',
    constructionSiteId: '2',
    constructionSiteName: 'Residential Tower A',
    date: new Date('2025-01-10'),
    startTime: new Date('2025-01-10T07:30:00'),
    endTime: new Date('2025-01-10T16:30:00'),
    status: 'present',
    totalHours: 9
  },
  {
    id: 'a3',
    employeeId: '5',
    employeeName: 'David Wilson',
    constructionSiteId: '3',
    constructionSiteName: 'Shopping Mall Extension',
    date: new Date('2025-01-10'),
    startTime: new Date('2025-01-10T08:15:00'),
    status: 'in-progress'
  },
  {
    id: 'a4',
    employeeId: '3',
    employeeName: 'Mike Johnson',
    constructionSiteId: '1',
    constructionSiteName: 'Downtown Office Complex',
    date: new Date('2025-01-09'),
    startTime: new Date('2025-01-09T08:00:00'),
    endTime: new Date('2025-01-09T17:30:00'),
    status: 'present',
    totalHours: 9.5
  },
  {
    id: 'a5',
    employeeId: '4',
    employeeName: 'Lisa Smith',
    constructionSiteId: '2',
    constructionSiteName: 'Residential Tower A',
    date: new Date('2025-01-09'),
    status: 'absent'
  }
];

export const mockTools: Tool[] = [
  {
    id: 't1',
    toolBrand: 'DeWalt',
    manufacturerSerialNumber: 'DW745-001234',
    quantity: 2,
    entryDate: new Date('2025-01-01'),
    documents: ['warranty.pdf', 'manual.pdf'],
    photos: ['https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400'],
    assignedEmployeeId: '3',
    assignedEmployeeName: 'Mike Johnson',
    createdBy: 'manager',
    createdAt: new Date('2025-01-01')
  },
  {
    id: 't2',
    toolBrand: 'Makita',
    manufacturerSerialNumber: 'XPH12Z-567890',
    quantity: 1,
    entryDate: new Date('2025-01-05'),
    documents: ['receipt.pdf'],
    photos: ['https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400'],
    assignedEmployeeId: '4',
    assignedEmployeeName: 'Lisa Smith',
    createdBy: 'manager',
    createdAt: new Date('2025-01-05')
  },
  {
    id: 't3',
    toolBrand: 'Milwaukee',
    manufacturerSerialNumber: 'M18-112233',
    quantity: 3,
    entryDate: new Date('2025-01-08'),
    exitDate: new Date('2025-01-15'),
    documents: [],
    photos: [],
    createdBy: 'manager',
    createdAt: new Date('2025-01-08')
  }
];

export const mockManagerNotes: ManagerNote[] = [
  {
    id: 'mn1',
    title: 'Safety Training Required',
    content: 'Please complete the safety training module by end of week. The certificate needs to be submitted to HR.',
    targetEmployeeId: '3',
    targetEmployeeName: 'Mike Johnson',
    createdBy: '1',
    createdByName: 'John Manager',
    createdAt: new Date('2025-01-09T10:00:00'),
    isRead: false
  },
  {
    id: 'mn2',
    title: 'Project Update Meeting',
    content: 'There will be a project update meeting tomorrow at 2 PM in the conference room. Please bring your progress reports.',
    targetEmployeeId: '4',
    targetEmployeeName: 'Lisa Smith',
    createdBy: '1',
    createdByName: 'John Manager',
    createdAt: new Date('2025-01-08T15:30:00'),
    isRead: true
  },
  {
    id: 'mn3',
    title: 'Equipment Maintenance',
    content: 'The assigned tools need maintenance check. Please schedule it with the maintenance team.',
    targetEmployeeId: '5',
    targetEmployeeName: 'David Wilson',
    createdBy: '2',
    createdByName: 'Sarah Director',
    createdAt: new Date('2025-01-07T09:15:00'),
    isRead: false
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