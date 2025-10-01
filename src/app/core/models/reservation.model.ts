export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface BaseReservationRequest {
  tableId: number;
  contactName: string;
  contactPhone: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
}

export interface ReservationRequest extends BaseReservationRequest {
  customerId: number;
  status?: ReservationStatus;
}

export interface AuthenticatedReservationRequest
  extends BaseReservationRequest {}

export interface ReservationResponse {
  id: number;
  customerId: number;
  customerName: string;
  tableId: number;
  tableNumber: string;
  contactName: string;
  contactPhone: string;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  status: ReservationStatus;
}
