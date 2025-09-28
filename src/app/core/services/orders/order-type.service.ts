import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { OrderTypeResponse } from '../../models/order-type.model';

@Injectable({
  providedIn: 'root',
})
export class OrderTypeService {
  constructor(private http: HttpClient) {}

  getAllOrderTypes(): Observable<ApiResponse<OrderTypeResponse[]>> {
    return this.http.get<ApiResponse<OrderTypeResponse[]>>(
      `${environment.apiUrl}/api/v1/order-types`
    );
  }
}
