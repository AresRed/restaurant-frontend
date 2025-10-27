export interface ReviewResponse {
  id: number;
  customerId: number;
  customerName: string;
  orderId: number;
  reservationId: number;
  productId: number;
  comment: string;
  rating: number;
  date: string;
}
