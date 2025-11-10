import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../models/base/api-response.model';
import {
  CreatePromotionRequest,
  PromotionResponse,
  UpdatePromotionRequest,
} from '../../../models/products/promotions/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient) {}

  getAllPromotions() {
    return this.http.get<ApiResponse<PromotionResponse[]>>(
      `${environment.apiUrl}/api/v1/promotions`
    );
  }

  getPromotionById(promotionId: number) {
    return this.http.get<ApiResponse<PromotionResponse>>(
      `${environment.apiUrl}/api/v1/promotions/${promotionId}`
    );
  }

  createPromotion(promotionRequest: CreatePromotionRequest) {
    return this.http.post<ApiResponse<PromotionResponse>>(
      `${environment.apiUrl}/api/v1/promotions`,
      promotionRequest
    );
  }

  updatePromotion(
    promotionId: number,
    promotionRequest: UpdatePromotionRequest
  ) {
    return this.http.put<ApiResponse<PromotionResponse>>(
      `${environment.apiUrl}/api/v1/promotions/${promotionId}`,
      promotionRequest
    );
  }

  deletePromotion(promotionId: number) {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/promotions/${promotionId}`
    );
  }
}
