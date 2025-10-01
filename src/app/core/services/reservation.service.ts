import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/base/api-response.model';
import { PagedApiResponse } from '../models/base/paged-api-response.model';
import {
  AuthenticatedReservationRequest,
  ReservationRequest,
  ReservationResponse,
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<
    ApiResponse<PagedApiResponse<ReservationResponse[]>>
  > {
    return this.http.get<ApiResponse<PagedApiResponse<ReservationResponse[]>>>(
      `${environment.apiUrl}/api/v1/reservations`
    );
  }

  getAllReservationsAuth(): Observable<
    ApiResponse<PagedApiResponse<ReservationResponse[]>>
  > {
    return this.http.get<ApiResponse<PagedApiResponse<ReservationResponse[]>>>(
      `${environment.apiUrl}/api/v1/reservations/me`
    );
  }

  getReservationById(
    reservationId: number
  ): Observable<ApiResponse<ReservationResponse>> {
    return this.http.get<ApiResponse<ReservationResponse>>(
      `${environment.apiUrl}/api/v1/reservations/${reservationId}`
    );
  }

  getReservationByCustomerId(
    customerId: number
  ): Observable<ApiResponse<PagedApiResponse<ReservationResponse[]>>> {
    return this.http.get<ApiResponse<PagedApiResponse<ReservationResponse[]>>>(
      `${environment.apiUrl}/api/v1/reservations/customer/${customerId}`
    );
  }

  addReservationAuth(
    reservationRequest: AuthenticatedReservationRequest
  ): Observable<ApiResponse<ReservationResponse>> {
    return this.http.post<ApiResponse<ReservationResponse>>(
      `${environment.apiUrl}/api/v1/reservations/me`,
      reservationRequest
    );
  }

  addReservation(
    reservationRequest: ReservationRequest
  ): Observable<ApiResponse<ReservationResponse[]>> {
    return this.http.post<ApiResponse<ReservationResponse[]>>(
      `${environment.apiUrl}/api/v1/reservations`,
      reservationRequest
    );
  }
}
