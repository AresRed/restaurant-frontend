import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { ScheduleRequest, ScheduleResponse } from '../../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getAllSchedules(): Observable<ApiResponse<ScheduleResponse[]>> {
    return this.http.get<ApiResponse<ScheduleResponse[]>>(
      `${environment.apiUrl}/api/v1/schedules`
    );
  }

  getScheduleById(
    scheduleId: number
  ): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.get<ApiResponse<ScheduleResponse>>(
      `${environment.apiUrl}/api/v1/schedules/${scheduleId}`
    );
  }

  addSchedule(
    scheduleRequest: ScheduleRequest
  ): Observable<ApiResponse<ScheduleResponse>> {
    return this.http.post<ApiResponse<ScheduleResponse>>(
      `${environment.apiUrl}/api/v1/schedules`,
      scheduleRequest
    );
  }

  updateSchedule(scheduleId: number, scheduleRequest: ScheduleRequest) {
    return this.http.put<ApiResponse<ScheduleResponse>>(
      `${environment.apiUrl}/api/v1/schedules/${scheduleId}`,
      scheduleRequest
    );
  }

  deleteSchedule(addressId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/schedules/${addressId}`
    );
  }
}
