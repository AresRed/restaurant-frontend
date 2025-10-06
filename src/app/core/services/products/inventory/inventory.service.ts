import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import { AddStockRequest, InventoryCreateRequest, InventoryDetailResponse, InventoryResponse, InventoryUpdateRequest } from '../../../models/products/inventory/inventory.model';


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
  ): Observable<ApiResponse<InventoryDetailResponse>> {
    return this.http.get<ApiResponse<InventoryDetailResponse>>(
      `${environment.apiUrl}/api/v1/inventories/${inventoryId}`
    );
  }

  getInventoryByIngredientId(ingredientId: number) {
    return this.http.get<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1/inventories/ingredient/${ingredientId}`
    );
  }

  addInventory(
    inventoryRequest: InventoryCreateRequest
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.post<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1/inventories`,
      inventoryRequest
    );
  }

  addStock(
    inventoryId: number,
    addStockRequest: AddStockRequest
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.post<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1/inventories/${inventoryId}/add-stock`,
      addStockRequest
    );
  }

  updateInventory(
    inventoryRequest: InventoryUpdateRequest,
    inventoryId: number
  ): Observable<ApiResponse<InventoryResponse>> {
    return this.http.put<ApiResponse<InventoryResponse>>(
      `${environment.apiUrl}/api/v1/inventories/${inventoryId}`,
      inventoryRequest
    );
  }

  deleteInventory(inventoryId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/v1/inventories/${inventoryId}`
    );
  }
}
