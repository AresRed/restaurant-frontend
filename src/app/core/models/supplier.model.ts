export interface SupplierResponse {
  id: number;
  companyName: string;
  contactName: string;
  phone: string;
  address: string;
  userId: number;
  username: string;
  email: string;
}

export interface SupplierRequest {
  username?: string;
  email?: string;
  password?: string;

  companyName: string;
  contactName: string;
  phone: string;
  address: string;
}
