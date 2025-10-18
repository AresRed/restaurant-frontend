import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { StoreRequest, StoreResponse } from '../../models/store/store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getAllStores(): Observable<ApiResponse<StoreResponse[]>> {
    return this.http.get<ApiResponse<StoreResponse[]>>(
      `${environment.apiUrl}/api/v1/stores`
    );
  }

  getStoreById(storeId: number): Observable<ApiResponse<StoreResponse>> {
    return this.http.get<ApiResponse<StoreResponse>>(
      `${environment.apiUrl}/api/v1/stores/${storeId}`
    );
  }

  addStore(storeRequest: StoreRequest): Observable<ApiResponse<StoreResponse>> {
    return this.http.post<ApiResponse<StoreResponse>>(
      `${environment.apiUrl}/api/v1/stores`,
      storeRequest
    );
  }

  updateStoreById(
    storeId: number,
    storeRequest: StoreRequest
  ): Observable<ApiResponse<StoreResponse>> {
    return this.http.put<ApiResponse<StoreResponse>>(
      `${environment.apiUrl}/api/v1/stores/${storeId}`,
      storeRequest
    );
  }

  deleteStoreById(storeId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/stores/${storeId}`
    );
  }
}
