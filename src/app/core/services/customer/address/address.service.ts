import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AddressAdminRequest,
  AddressCustomerRequest,
  AddressResponse,
} from '../../../models/address.model';
import { ApiResponse } from '../../../models/base/api-response.model';
import { PagedApiResponse } from '../../../models/base/paged-api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  getAddressById(addressId: number): Observable<ApiResponse<AddressResponse>> {
    return this.http.get<ApiResponse<AddressResponse>>(
      `${environment.apiUrl}/api/v1/addresses/${addressId}`
    );
  }

  getAllAddressAuth(): Observable<
    ApiResponse<PagedApiResponse<AddressResponse[]>>
  > {
    return this.http.get<ApiResponse<PagedApiResponse<AddressResponse[]>>>(
      `${environment.apiUrl}/api/v1/addresses/me`
    );
  }

  getAllAddressByCustomerIdAdmin(
    customerId: number
  ): Observable<ApiResponse<PagedApiResponse<AddressResponse[]>>> {
    return this.http.get<ApiResponse<PagedApiResponse<AddressResponse[]>>>(
      `${environment.apiUrl}/api/v1/addresses/customer/${customerId}`
    );
  }

  addAddressAdmin(addressRequest: AddressAdminRequest) {
    return this.http.post<ApiResponse<AddressResponse>>(
      `${environment.apiUrl}/api/v1/addresses/admin`,
      addressRequest
    );
  }

  addAddressAuth(addressRequest: AddressCustomerRequest) {
    return this.http.post<ApiResponse<AddressResponse>>(
      `${environment.apiUrl}/api/v1/addresses/me`,
      addressRequest
    );
  }

  updateAddressAdmin(addressId: number, addressRequest: AddressAdminRequest) {
    return this.http.put<ApiResponse<AddressResponse>>(
      `${environment.apiUrl}/api/v1/addresses/${addressId}`,
      addressRequest
    );
  }

  deleteAddress(addressId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/addresses/${addressId}`
    );
  }
}
