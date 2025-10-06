import { IngredientResponse } from './ingredient/ingredient.model';

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface ProductDetailResponse {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  ingredients: IngredientResponse[];
}
