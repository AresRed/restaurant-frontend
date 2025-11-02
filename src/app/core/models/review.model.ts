export interface ReviewResponse {
  id: number;
  customerId: number;
  customerName: string;
  orderId: number | null;
  reservationId: number | null;
  productId: number | null;
  comment: string | null;
  rating: number;
  date: string;
}

/**
 * Este es el DTO que enviamos al backend.
 * No tiene 'id' ni 'customerId'.
 */
export interface ReviewCreateRequest {
  orderId?: number;
  reservationId?: number;
  productId?: number;
  comment?: string;
  rating: number;
}

/**
 * Este es el DTO que usas para ACTUALIZAR.
 * Es casi igual, pero lo separamos por claridad.
 */
export interface ReviewUpdateRequest {
  comment?: string;
  rating: number;
}
