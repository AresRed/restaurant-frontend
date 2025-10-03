export interface InventoryResponse {
  id: number;
  ingredientId: number;
  ingredientName: string;
  unitName: string;
  unitSymbol: string;
  currentStock: number;
  minimumStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryRequest {}


