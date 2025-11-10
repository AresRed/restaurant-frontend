// Este es el tipo de dato que viene del backend
export type TableStatus = 'FREE' | 'OCCUPIED' | 'OUT_OF_SERVICE';

export interface TableAvailabilityResponse {
  id: number;
  name: string;
  capacity: number;
  minCapacity: number;
  availableTimes: string[];
}

export interface TableResponse {
  imageUrl?: string;
  id: number;
  code: string;
  alias: string;
  capacity: number;
  minCapacity: number;
  optimalCapacity: number;
  priority: number;
  description: string;
  openTime: string;
  closeTime: string;
  reservationDurationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  status: TableStatus;
  activeOrderId: number | null;
}

export type TableRequest = Pick<
  TableResponse,
  | 'code'
  | 'alias'
  | 'capacity'
  | 'minCapacity'
  | 'optimalCapacity'
  | 'priority'
  | 'description'
  | 'openTime'
  | 'closeTime'
  | 'reservationDurationMinutes'
  | 'bufferBeforeMinutes'
  | 'bufferAfterMinutes'
  | 'status'
>;
