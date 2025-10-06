import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import { ProductResponse } from '../../../models/products/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryMovementService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse<ProductResponse[]>> {
    // TODO: Cambiar
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}/api/v1/products`
    );
  }
}
