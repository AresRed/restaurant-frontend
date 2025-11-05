import { Roles } from '../base/roles.model';

export interface CustomerResponse {
  id: number;
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  points: number;

  enabled: boolean;
  emailVerified: boolean;
  roles: Roles[];
  provider: string;
  profileImageUrl: string;
  lastUsernameChange: string;
  lastEmailChange: string;
}

export interface CustomerRequest {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  points?: number;
}

export interface PointsHistoryResponse {
  points: number;
  event: string;
  createdAt: string;
}
