import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import {
  ProductDetailResponse,
  ProductResponse,
} from '../../../models/products/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}/api/v1/products`
    );
  }

  getProduct(productId: number) {
    return this.http.get<ApiResponse<ProductDetailResponse[]>>(
      `${environment.apiUrl}/api/v1/products/${productId}`
    );
  }

  updateProduct(productId: number) {}

  deleteProduct(productId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/products/${productId}`
    );
  }
}
