import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import { FeedbackLoyaltySummaryResponse } from '../../models/feedback-loyalty/feedback-loyalty.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackLoyaltyService {
  constructor(private http: HttpClient) {}

  getFeedbackLoyaltySummary() {
    return this.http.get<ApiResponse<FeedbackLoyaltySummaryResponse>>(
      `${environment.apiUrl}/api/v1/feedback-loyalty/summary`
    );
  }
}
