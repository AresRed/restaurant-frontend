export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  categoryId: number;
  preparationTimeMinutes: number;
  ingredients: ProductIngredientRequest[];
}

export interface ProductIngredientRequest {
  ingredientId: number;
  quantity: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  preparationTimeMinutes: number;
  ingredients: IngredientResponseForProduct[];
  active: boolean;
}

export interface IngredientResponseForProduct {
  ingredientId: number;
  ingredientName: string;
  unitName: string;
  unitSymbol: string;
  quantity: number;
}
