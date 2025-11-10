import { ReviewResponse } from '../review.model';
import { RewardResponse } from '../reward/reward.model';

export interface LoyalCustomerResponse {
  id: number;
  fullName: string;
  email: string;
  points: number;
}

export interface FeedbackLoyaltySummaryResponse {
  recentReviews: ReviewResponse[];
  averageRating: number;

  totalRegisteredCustomers: number;
  totalPointsAccumulated: number;
  totalPointsRedeemed: number;
  topLoyalCustomers: LoyalCustomerResponse[];
  availableRewards: RewardResponse[];
}
