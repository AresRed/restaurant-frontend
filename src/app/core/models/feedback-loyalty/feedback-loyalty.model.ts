import { ReviewResponse } from '../review.model';

export interface LoyalCustomerResponse {
  id: number;
  fullName: string;
  email: string;
  points: number;
}

export interface RewardResponse {
  id: number;
  name: string;
  description: string;
  requiredPoints: number;
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
