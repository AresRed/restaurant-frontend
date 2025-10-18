export interface StoreResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
}

export interface StoreRequest {
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
}
