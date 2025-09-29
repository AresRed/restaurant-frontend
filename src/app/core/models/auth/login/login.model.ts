import { User } from '../../user.model';

export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
