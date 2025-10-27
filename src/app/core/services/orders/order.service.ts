import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAllOrders(): Observable<ApiResponse<OrderResponse[]>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    return this.http.get<ApiResponse<OrderResponse[]>>(
      `${environment.apiUrl}/api/v1/orders`,
      { headers }
    );
  }

  getAllOrdersAuth(): Observable<ApiResponse<OrderResponse[]>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    return this.http.get<ApiResponse<OrderResponse[]>>(
      `${environment.apiUrl}/api/v1/orders/me`,
      { headers }
    );
  }

  getOrderById(orderId: number): Observable<ApiResponse<OrderResponse>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    return this.http.get<ApiResponse<OrderResponse>>(
      `${environment.apiUrl}/api/v1/orders/${orderId}`,
      { headers }
    );
  }

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

  cancelOrder(orderId: number) {
    return this.http.put<ApiResponse<OrderResponse>>(
      `${environment.apiUrl}/api/v1/orders/${orderId}/cancel`,
      null
    );
  }
}
