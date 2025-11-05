import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  OrderRequest,
  OrderResponse,
} from '../../models/order/orderhttp/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/v1/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(typeCode?: string): Observable<ApiResponse<OrderResponse[]>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    let params = new HttpParams();
    if (typeCode) {
      params = params.set('type', typeCode);
    }

    return this.http.get<ApiResponse<OrderResponse[]>>(this.apiUrl, {
      headers,
      params,
    });
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

  createPosSale(orderRequest: OrderRequest) {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    return this.http.post<ApiResponse<OrderResponse>>(
      `${environment.apiUrl}/api/v1/orders/pos/sale`,
      orderRequest,
      { headers }
    );
  }

  updateOrderStatus(
    orderId: number,
    newStatusCode: string
  ): Observable<ApiResponse<OrderResponse>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });

    const payload = { newStatusCode };
    return this.http.put<ApiResponse<OrderResponse>>(
      `${this.apiUrl}/${orderId}/status`,
      payload,
      { headers }
    );
  }

  assignDriver(
    orderId: number,
    employeeId: number
  ): Observable<ApiResponse<OrderResponse>> {
    const headers = new HttpHeaders({
      'Accept-Language': 'es',
    });
    const payload = { employeeId };
    return this.http.put<ApiResponse<OrderResponse>>(
      `${this.apiUrl}/${orderId}/assign-driver`,
      payload,
      { headers }
    );
  }

  cancelOrder(orderId: number) {
    return this.http.put<ApiResponse<OrderResponse>>(
      `${environment.apiUrl}/api/v1/orders/${orderId}/cancel`,
      null
    );
  }
}
