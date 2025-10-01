export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'GITHUB';

export interface UserResponse {
  username: string;
  email: string;
  enabled: boolean;
  roles: string[];
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  provider: AuthProvider;
  hasPassword: boolean;
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
