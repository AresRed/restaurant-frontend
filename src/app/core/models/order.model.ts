export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  statusId: number;
  typeId: number;
  addressId: number;
  details: OrderDetailRequest[];
}

export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  addressId: number;
  addressDescription: string;
  date: Date;
  statusId: number;
  statusName: string;
  typeId: number;
  typeName: string;
  total: number;
  details: OrderDetailResponse[];
}

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number
}

