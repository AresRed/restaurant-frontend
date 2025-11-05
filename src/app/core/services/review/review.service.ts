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

  checkIfReviewed(params: {
    orderId?: number;
    productId?: number;
    reservationId?: number;
  }) {
    const queryParams = new URLSearchParams();

    if (params.orderId)
      queryParams.append('orderId', params.orderId.toString());
    if (params.productId)
      queryParams.append('productId', params.productId.toString());
    if (params.reservationId)
      queryParams.append('reservationId', params.reservationId.toString());

    return this.http.get<ApiResponse<boolean>>(
      `${environment.apiUrl}/api/v1/reviews/check?${queryParams.toString()}`
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
