export interface CustomerResponse {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  points: number;
}

export interface CustomerRequest {
  userId: number;
  points: number;
}

export interface PointsHistoryResponse {
  points: number;
  event: string;
  createdAt: string;
}
