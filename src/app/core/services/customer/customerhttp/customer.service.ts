import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import { PagedApiResponse } from '../../../models/base/paged-api-response.model';
import {
  CustomerRequest,
  CustomerResponse,
  PointsHistoryResponse,
} from '../../../models/customer/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllCustomers() {
    return this.http.get<ApiResponse<PagedApiResponse<CustomerResponse[]>>>(
      `${environment.apiUrl}/api/v1/customers`
    );
  }

  getCustomerById(
    customerId: number
  ): Observable<ApiResponse<CustomerResponse>> {
    return this.http.get<ApiResponse<CustomerResponse>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}`
    );
  }

  getPoints(customerId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}/points`
    );
  }

  getPointsHistory(
    customerId: number
  ): Observable<ApiResponse<PagedApiResponse<PointsHistoryResponse>>> {
    return this.http.get<ApiResponse<PagedApiResponse<PointsHistoryResponse>>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}/points/history`
    );
  }

  searchCustomers(query: string): Observable<ApiResponse<CustomerResponse[]>> {
    const params = new HttpParams().set('query', query);

    return this.http.get<ApiResponse<CustomerResponse[]>>(
      `${environment.apiUrl}/api/v1/customers/search`,
      { params }
    );
  }

  createCustomer(
    customerRequest: CustomerRequest
  ): Observable<ApiResponse<CustomerResponse>> {
    return this.http.post<ApiResponse<CustomerResponse>>(
      `${environment.apiUrl}/api/v1/customers`,
      customerRequest
    );
  }

  addPoints(customerId: number): Observable<ApiResponse<CustomerResponse>> {
    return this.http.post<ApiResponse<CustomerResponse>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}/points/add`,
      null
    );
  }

  subtractPoints(
    customerId: number
  ): Observable<ApiResponse<CustomerResponse>> {
    return this.http.post<ApiResponse<CustomerResponse>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}/points/subtract`,
      null
    );
  }

  updateCustomer(
    customerId: number,
    customerRequest: CustomerRequest
  ): Observable<ApiResponse<CustomerResponse>> {
    return this.http.put<ApiResponse<CustomerResponse>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}`,
      customerRequest
    );
  }

  deleteCustomer(customerId: number) {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/customers/${customerId}`
    );
  }
}
