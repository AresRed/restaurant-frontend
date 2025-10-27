export interface SupplierResponse {
  id: number;
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
  userId: number;
}

export interface SupplierRequest {
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
}

