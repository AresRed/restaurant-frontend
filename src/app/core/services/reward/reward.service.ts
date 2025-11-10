import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/base/api-response.model';
import {
  RewardRequest,
  RewardResponse,
} from '../../models/reward/reward.model';

@Injectable({
  providedIn: 'root',
})
export class RewardService {
  constructor(private http: HttpClient) {}

  getActiveRewards() {
    return this.http.get<ApiResponse<RewardResponse[]>>(
      `${environment.apiUrl}/api/v1/rewards/active`
    );
  }

  getAllRewards() {
    return this.http.get<ApiResponse<RewardResponse[]>>(
      `${environment.apiUrl}/api/v1/rewards`
    );
  }

  getRewardById(rewardId: number) {
    return this.http.get<ApiResponse<RewardResponse>>(
      `${environment.apiUrl}/api/v1/rewards/${rewardId}`
    );
  }

  createReward(rewardRequest: RewardRequest) {
    return this.http.post<ApiResponse<RewardResponse>>(
      `${environment.apiUrl}/api/v1/rewards`,
      rewardRequest
    );
  }

  updateReward(rewardId: number, rewardRequest: RewardRequest) {
    return this.http.put(
      `${environment.apiUrl}/api/v1/rewards/${rewardId}`,
      rewardRequest
    );
  }

  deleteReward(rewardId: number) {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/api/v1/rewards/${rewardId}`
    );
  }
}
