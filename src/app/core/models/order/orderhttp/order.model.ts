export interface OrderDetailRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  statusId: number;
  typeId: number;
  deliveryAddress?: DeliveryAddressRequest;
  details: OrderDetailRequest[];
  tableId?: number;
  pickupStoreId?: number;
}

export interface DeliveryAddressRequest {
  street?: string;
  reference?: string;
  city?: string;
  instructions?: string;
  province?: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
}

export interface OrderStatusStepResponse {
  code: string;
  name: string;
  step: number;
}


export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  employeeId: number | null;
  employeeName: string | null;

  deliveryStreet: string;
  deliveryReference: string;
  deliveryCity: string;
  deliveryInstructions: string;
  deliveryProvince: string | null;
  deliveryZipCode: string | null;
  deliveryLatitude: number;
  deliveryLongitude: number;

  tableId: number;
  tableCode: string;

  pickupStoreId: number;
  pickupStoreName: string;
  pickupStoreAddress: string;

  estimatedTime: number;
  estimatedDistance: string;
  estimatedDuration: string;

  currentLatitude: string;
  currentLongitude: string;

  date: string;

  statusId: number;
  statusName: string;
  typeId: number;
  typeName: string;
  total: number;
  details: OrderDetailResponse[];
  timelineSteps: OrderStatusStepResponse[];
}

export interface OrderDetailResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

