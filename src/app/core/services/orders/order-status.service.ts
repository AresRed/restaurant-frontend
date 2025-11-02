import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  OrderStatusRequest,
  OrderStatusResponse,
} from '../../models/order/order-statuses/order-statuses.model';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  constructor(private http: HttpClient) {}

  getAllOrderStatuses() {
    return this.http.get<ApiResponse<OrderStatusResponse[]>>(
      `${environment.apiUrl}/api/v1/order-statuses`
    );
  }

  getOrderStatusById(orderStatusId: number) {
    return this.http.get<ApiResponse<OrderStatusResponse[]>>(
      `${environment.apiUrl}/api/v1/order-statuses/${orderStatusId}`
    );
  }

  addOrderStatus(orderStatusRequest: OrderStatusRequest) {
    return this.http.post<ApiResponse<OrderStatusResponse>>(
      `${environment.apiUrl}/api/v1/order-statuses`,
      orderStatusRequest
    );
  }

  updateOrderStatus(orderStatusId: number, request: OrderStatusRequest) {
    return this.http.put<ApiResponse<OrderStatusResponse>>(
      `${environment.apiUrl}/api/v1/order-statuses/${orderStatusId}`,
      request
    );
  }

  deleteOrderStatus(orderStatusId: number) {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/order-statuses/${orderStatusId}`
    );
  }
}
