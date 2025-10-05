import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  Subject } from 'rxjs';




interface AddressCustomerRequest {
  street: string;
  reference: string | null;
  city: string;
  province: string;
  zipCode: string | null;
  instructions: string | null;
}

interface AddressResponse {
  success: boolean;
  message: string;
  data: any
}
@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  private apiUrl=  'http://localhost:8080/api/v1/addresses'; 

  constructor(private http: HttpClient){}

  private dialogState = new Subject<boolean>();
  dialogState$ = this.dialogState.asObservable();

  open() {
    this.dialogState.next(true);
  }

  close() {
    this.dialogState.next(false);
  }
  createAddress(addressData: AddressCustomerRequest): Observable<AddressResponse> {
    // El endpoint para el cliente es /me
    return this.http.post<AddressResponse>(`${this.apiUrl}/me`, addressData);
  }
}
