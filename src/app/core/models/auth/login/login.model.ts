import { UserResponse } from "../../user.model";

export interface UserLoginResponse {
  accessToken: string;
  sessionId: string;
  user: UserResponse;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
