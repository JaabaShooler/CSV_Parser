export interface DataItem {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  age: number;
  experience: number;
  yearlyIncome: number;
  hasChildren: boolean;
  licenseStates: string[];
  expirationDate: string;
  licenseNumber: string;
  duplicateWith?: number;
}