import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  PositionRequest,
  PositionResponse,
} from '../../models/employee/position.model';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  getAllPositions(): Observable<ApiResponse<PositionResponse[]>> {
    return this.http.get<ApiResponse<PositionResponse[]>>(
      `${environment.apiUrl}/api/v1/positions`
    );
  }

  getPositionById(
    positionId: number
  ): Observable<ApiResponse<PositionResponse>> {
    return this.http.get<ApiResponse<PositionResponse>>(
      `${environment.apiUrl}/api/v1/positions/${positionId}`
    );
  }

  updatePositionById(
    positionId: number,
    positionRequest: PositionRequest
  ): Observable<ApiResponse<PositionResponse>> {
    return this.http.put<ApiResponse<PositionResponse>>(
      `${environment.apiUrl}/api/v1/positions/${positionId}`,
      positionRequest
    );
  }

  deletePositionById(positionId: number) {
    return this.http.delete<ApiResponse<PositionResponse>>(
      `${environment.apiUrl}/api/v1/positions/${positionId}`
    );
  }
}
