export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  company: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  units: Unit[];
  createdAt: Date;
}

export interface Unit {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: 'PGR' | 'PCSMO' | 'LTCAT' | 'CUSTOM';
  companyId: string;
  unitId: string;
  filePath: string;
  uploadDate: Date;
  validityDate: Date;
  status: 'valid' | 'expired' | 'expiring';
  uploadedBy: string;
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  sector: string;
  position: string;
  photo?: string;
  companyId: string;
  unitId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface EPI {
  id: string;
  name: string;
  ca: string;
  type: string;
  currentStock: number;
  minimumStock: number;
  price?: number;
  createdAt: Date;
}

export interface Sector {
  id: string;
  name: string;
  requiredEPIs: string[];
  companyId: string;
  createdAt: Date;
}

export interface Position {
  id: string;
  name: string;
  requiredEPIs: string[];
  companyId: string;
  createdAt: Date;
}

export interface Risk {
  id: string;
  name: string;
  requiredEPIs: string[];
  companyId: string;
  createdAt: Date;
}

export interface EPIDelivery {
  id: string;
  employeeId: string;
  episDelivered: {
    epiId: string;
    quantity: number;
  }[];
  deliveryDate: Date;
  biometricData?: {
    type: 'facial' | 'digital';
    dataPath: string;
    verified: boolean;
  };
  deliveredBy: string;
  batchId?: string;
  createdAt: Date;
}

export interface DashboardKPI {
  totalDocuments: number;
  validDocuments: number;
  expiredDocuments: number;
  expiringDocuments: number;
  totalEmployees: number;
  episDeliveredThisMonth: number;
  totalEPIs: number;
  lowStockEPIs: number;
}