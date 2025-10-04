import { Roles } from './base/roles.model';

export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'GITHUB';

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: Roles[];
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  provider: AuthProvider;
  hasPassword: boolean;
  profileImageUrl: string;
  usernameNextChange: Date;
  emailNextChange: Date;
}

export interface UpdateProfileResponse {
  user: UserResponse;
  token: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
}

export interface UserSessionResponse {
  sessionId: string;
  expiryDate: Date;
  ip: string;
  userAgent: string;
}
