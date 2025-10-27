import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/base/api-response.model';
import { IngredientResponse } from '../models/products/product/ingredient/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  constructor(private http: HttpClient) {}

  getAllIngredients(): Observable<ApiResponse<IngredientResponse[]>> {
    return this.http.get<ApiResponse<IngredientResponse[]>>(
      `${environment.apiUrl}/api/v1/ingredients`
    );
  }
}
