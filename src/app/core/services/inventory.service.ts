import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/base/api-response.model';
import { InventoryRequest, InventoryResponse } from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  getAllInventory(): Observable<ApiResponse<InventoryResponse[]>> {
    return this.http.get<ApiResponse<InventoryResponse[]>>(
      `${environment.apiUrl}/api/v1/inventories`
    );
  }

  getInventoryById(
    inventoryId: number
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.get<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1//inventories/${inventoryId}`
    );
  }

  getInventoryByIngredientId(ingredientId: number) {
    return this.http.get<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1//inventories/ingredient/${ingredientId}`
    );
  }

  addInventory(
    inventoryRequest: InventoryRequest
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.post<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1//inventories`,
      inventoryRequest
    );
  }

  updateInventory(
    inventoryRequest: InventoryRequest,
    inventoryId: number
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.put<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/inventories/${inventoryId}`,
      inventoryRequest
    );
  }

  // TODO: Aca devuelve not content
  deleteInventory(inventoryId: number) {
    return this.http.delete(`${environment.apiUrl}/inventories/${inventoryId}`);
  }
}
