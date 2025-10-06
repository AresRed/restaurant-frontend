export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
}

export enum MovementSource {
  ORDER = 'ORDER',
  SALE = 'SALE',
  MANUAL = 'MANUAL',
  PURCHASE = 'PURCHASE',
}

export interface InventoryMovementResponse {
  id: number;
  ingredientId: number;
  ingredientName: string;
  unitName: string;
  unitSymbol: string;
  type: MovementType;
  quantity: number;
  date: string;
  reason: string;
  source: MovementSource;
  referenceId: number | null;
  createdAt: string;
}
