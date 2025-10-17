import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  TableAvailabilityResponse,
  TableRequest,
  TableResponse,
} from '../../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient) {}

  getTablesAvailabilityTimes(
    numberOfPeople: number,
    date: string,
    filterByCapacity: boolean = true
  ): Observable<ApiResponse<TableAvailabilityResponse[]>> {
    const params = new HttpParams()
      .set('numberOfPeople', numberOfPeople.toString())
      .set('date', date)
      .set('filterByCapacity', filterByCapacity.toString());

    return this.http.get<ApiResponse<TableAvailabilityResponse[]>>(
      `${environment.apiUrl}/api/v1/tables/available-times`,
      { params }
    );
  }

  getAllTables(): Observable<ApiResponse<TableResponse[]>> {
    return this.http.get<ApiResponse<TableResponse[]>>(
      `${environment.apiUrl}/api/v1/tables`
    );
  }

  updateTable(
    tableId: number,
    tableRequest: TableRequest
  ): Observable<ApiResponse<TableResponse>> {
    return this.http.put<ApiResponse<TableResponse>>(
      `${environment.apiUrl}/api/v1/tables/${tableId}`,
      tableRequest
    );
  }
}
