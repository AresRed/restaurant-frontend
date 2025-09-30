export type TableStatus = 'FREE' | 'OCCUPIED' | 'OUT_OF_SERVICE';

export interface TableAvailabilityResponse {
  id: number;
  name: string;
  capacity: number;
  minCapacity: number;
  availableTimes: string[];
}

export interface TableResponse {
  id: number;
  name: string;
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
