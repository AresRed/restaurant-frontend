import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import {
  ProductRequest,
  ProductResponse,
} from '../../../models/products/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllActive(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}/api/v1/products`
    );
  }

  getAllIncludingInactive() {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}/api/v1/products/all`
    );
  }

  getProduct(productId: number): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${environment.apiUrl}/api/v1/products/${productId}`
    );
  }

  addProduct(request: ProductRequest) {
    return this.http.post<ApiResponse<ProductResponse>>(
      `${environment.apiUrl}/api/v1/products`,
      request
    );
  }

  updateProduct(productId: number, updateRequest: ProductRequest) {
    return this.http.put<ApiResponse<ProductResponse>>(
      `${environment.apiUrl}/api/v1/products/${productId}`,
      updateRequest
    );
  }

  toggleActive(productId: number) {
    return this.http.patch<ApiResponse<ProductResponse>>(
      `${environment.apiUrl}/api/v1/products/${productId}/toggle-active`,
      null
    );
  }

  deleteProduct(productId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/products/${productId}`
    );
  }
}
