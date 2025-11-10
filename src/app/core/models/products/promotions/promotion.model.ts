export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

// --- Interfaces para PromotionResponse (Sin cambios) ---

export interface ProductStub {
  id: number;
  name: string;
}

export interface CategoryStub {
  id: number;
  name: string;
}

export interface PromotionResponse {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  discountType: DiscountType;
  discountValue: number;
  applicableProducts: ProductStub[];
  applicableCategories: CategoryStub[];
}

export interface CreatePromotionRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  discountType: DiscountType;
  discountValue: number;
  applicableProductIds?: number[];
  applicableCategoryIds?: number[];
}

export interface UpdatePromotionRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  discountType: DiscountType;
  discountValue: number;
  applicableProductIds?: number[];
  applicableCategoryIds?: number[];
}
