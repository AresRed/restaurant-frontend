
export interface RewardResponse {
  id: number;
  name: string;
  description: string;
  requiredPoints: number;
  active: boolean;
}

export interface RewardRequest {
  name: string;
  description: string;
  requiredPoints: number;
  active: boolean;
}

