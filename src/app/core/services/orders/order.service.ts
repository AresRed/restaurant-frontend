import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { OrderRequest, OrderResponse } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(request: OrderRequest): Observable<ApiResponse<OrderResponse>> {
    return this.http.post<ApiResponse<OrderResponse>>(
      `${environment.apiUrl}/api/v1/orders`,
      request
    );
  }

  async createOrderAsync(
    request: OrderRequest
  ): Promise<ApiResponse<OrderResponse>> {
    return await firstValueFrom(this.createOrder(request));
  }
}
