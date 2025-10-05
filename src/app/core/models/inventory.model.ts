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

export interface InventoryCreateRequest {
  ingredientId: number;
  currentStock: number;
  minimumStock: number;
}

export interface InventoryUpdateRequest {
  currentStock: number;
  minimumStock: number;
}

export interface AddStockRequest {
  quantity: number;
  supplierId?: number;
  reason?: string;
}
