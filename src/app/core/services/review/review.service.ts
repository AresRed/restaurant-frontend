import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '../../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  getReview(reviewId: number) {
    return this.http.get<ApiResponse<ReviewResponse>>(
      `${environment.apiUrl}/api/v1/reviews/${reviewId}`
    );
  }

  getReviewByCustomer(customerId: number) {
    return this.http.get<ApiResponse<ReviewResponse[]>>(
      `${environment.apiUrl}/api/v1/reviews/customer/${customerId}`
    );
  }

  createReview(reviewRequest: ReviewCreateRequest) {
    return this.http.post<ApiResponse<ReviewResponse>>(
      `${environment.apiUrl}/api/v1/reviews`,
      reviewRequest
    );
  }

  updateReview(reviewId: number, reviewRequest: ReviewUpdateRequest) {
    return this.http.put<ApiResponse<ReviewResponse>>(
      `${environment.apiUrl}/api/v1/reviews/${reviewId}`,
      reviewRequest
    );
  }

  deleteReview(reviewId: number) {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/reviews/${reviewId}`
    );
  }
}
