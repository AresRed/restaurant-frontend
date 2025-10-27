import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { SupplierRequest, SupplierResponse } from '../../models/supplier.model';

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

  getSupplierById(
    supplierId: number
  ): Observable<ApiResponse<SupplierResponse>> {
    return this.http.get<ApiResponse<SupplierResponse>>(
      `${environment.apiUrl}/api/v1/suppliers/${supplierId}`
    );
  }

  addSupplier(supplierRequest: SupplierRequest) {
    return this.http.post<ApiResponse<SupplierResponse>>(
      `${environment.apiUrl}/api/v1/suppliers`,
      supplierRequest
    );
  }

  editSupplier(supplierId: number, supplierRequest: SupplierRequest) {
    return this.http.put<ApiResponse<SupplierResponse>>(
      `${environment.apiUrl}/api/v1/suppliers/${supplierId}`,
      supplierRequest
    );
  }

  deleteSupplier(supplierId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/suppliers/${supplierId}`
    );
  }
}
