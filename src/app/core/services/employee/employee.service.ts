import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  EmployeeRequest,
  EmployeeResponse,
} from '../../models/employee/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<ApiResponse<EmployeeResponse[]>> {
    return this.http.get<ApiResponse<EmployeeResponse[]>>(
      `${environment.apiUrl}/api/v1/employees`
    );
  }

  getEmployeeById(
    idEmployee: number
  ): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.get<ApiResponse<EmployeeResponse>>(
      `${environment.apiUrl}/api/v1/employees/${idEmployee}`
    );
  }

  updateEmployeeById(
    idEmployee: number,
    employeeRequest: EmployeeRequest
  ): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.put<ApiResponse<EmployeeResponse>>(
      `${environment.apiUrl}/api/v1/employees/${idEmployee}`,
      employeeRequest
    );
  }
}
