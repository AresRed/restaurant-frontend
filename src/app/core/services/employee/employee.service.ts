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
  private apiUrl = `${environment.apiUrl}/api/v1/employees`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<ApiResponse<EmployeeResponse[]>> {
    return this.http.get<ApiResponse<EmployeeResponse[]>>(this.apiUrl);
  }

  getEmployeeById(
    idEmployee: number
  ): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.get<ApiResponse<EmployeeResponse>>(
      `${this.apiUrl}/${idEmployee}`
    );
  }

  // --- NUEVO MÉTODO (Recomendado) ---
  createEmployee(
    employeeRequest: EmployeeRequest
  ): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.post<ApiResponse<EmployeeResponse>>(
      this.apiUrl,
      employeeRequest
    );
  }

  updateEmployeeById(
    idEmployee: number,
    employeeRequest: EmployeeRequest
  ): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.put<ApiResponse<EmployeeResponse>>(
      `${this.apiUrl}/${idEmployee}`,
      employeeRequest
    );
  }
}
