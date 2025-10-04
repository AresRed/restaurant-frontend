export interface RoleSummary {
  id: number;
  name: string;
}

export interface PositionResponse {
  id: number;
  name: string;
  description: string;
  roles: RoleSummary[];
}

export interface PositionRequest {
  name: string;
  description: string;
  roleIds: number[];
}
