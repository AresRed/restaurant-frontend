export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  categoryId: number;
  preparationTimeMinutes: number;
  ingredients: ProductIngredientRequest[];
  comboItems: ComboItemRequest[];
  isCombo: boolean;
}

export interface ComboItemRequest {
  simpleProductId: number;
  quantity: number;
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
  active: boolean;
  isCombo: boolean;
  
  comboItems: ComboItemResponseStub[];
  ingredients: IngredientResponseForProduct[];
}

export interface ComboItemResponseStub {
  simpleProductId: number;
  simpleProductName: string;
  quantity: number;
}

export interface IngredientResponseForProduct {
  ingredientId: number;
  ingredientName: string;
  unitName: string;
  unitSymbol: string;
  quantity: number;
}
