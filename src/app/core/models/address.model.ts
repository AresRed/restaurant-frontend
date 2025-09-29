export interface AddressResponse {
  id: number;
  customerId: number;
  street: string;
  reference?: string;
  city: string;
  province: string;
  zipCode?: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updateBy: number;
}

export interface AddressAdminRequest {
  customerId: number;
  street: string;
  city: string;
  province: string;
  reference?: string;
  zipCode?: string;
  instructions?: string;
}

export interface AddressCustomerRequest {
  street: string;
  city: string;
  province: string;
  reference?: string;
  zipCode?: string;
  instructions?: string;
}
