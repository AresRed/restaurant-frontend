import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/base/api-response.model';
import {
  PasswordChangeRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateUserRequest,
  UserResponse,
  UserSessionResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfileAuth(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(
      `${environment.apiUrl}/api/v1/users/me`
    );
  }

  getSessionsAuth(): Observable<ApiResponse<UserSessionResponse[]>> {
    return this.http.get<ApiResponse<UserSessionResponse[]>>(
      `${environment.apiUrl}/api/v1/users/sessions`
    );
  }

  getAllPersonalForAdmin(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(
      `${environment.apiUrl}/api/v1/users/admin`
    );
  }

  getUserById(userId: number): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(
      `${environment.apiUrl}/api/v1/users/${userId}`
    );
  }

  updateUserById(
    userId: number,
    userRequest: UpdateUserRequest
  ): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(
      `${environment.apiUrl}/api/v1/users/${userId}`,
      userRequest
    );
  }

  updateProfileAuth(
    updateProfileRequest: UpdateProfileRequest
  ): Observable<ApiResponse<UpdateProfileResponse>> {
    return this.http.put<ApiResponse<UpdateProfileResponse>>(
      `${environment.apiUrl}/api/v1/users/update-profile`,
      updateProfileRequest
    );
  }

  updateProfileImageAuth(file: File): Observable<ApiResponse<UserResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<ApiResponse<UserResponse>>(
      `${environment.apiUrl}/api/v1/users/profile-image`,
      formData
    );
  }

  updatePasswordAuth(
    passwordChangeRequest: PasswordChangeRequest
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${environment.apiUrl}/api/v1/users/change-password`,
      passwordChangeRequest
    );
  }
}
