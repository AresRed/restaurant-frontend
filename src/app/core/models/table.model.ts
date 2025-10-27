export type TableStatus = 'FREE' | 'OCCUPIED' | 'OUT_OF_SERVICE';

export interface TableAvailabilityResponse {
  id: number;
  name: string;
  capacity: number;
  minCapacity: number;
  availableTimes: string[];
}

export interface TableResponse {
  imageUrl?: string; // La imagen es opcional
  id: number;
  code: string;
  alias: string;
  capacity: number;
  minCapacity: number;
  optimalCapacity: number;
  priority: number;
  description: string;
  openTime: Date;
  closeTime: Date;
  reservationDurationMinutes: string;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  status: TableStatus;
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
>;
