import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { SupplierResponse } from '../../models/supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<ApiResponse<SupplierResponse[]>> {
    return this.http.get<ApiResponse<SupplierResponse[]>>(
      `${environment.apiUrl}/api/v1/suppliers`
    );
  }
}
