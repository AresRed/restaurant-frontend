export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface EmployeeResponse {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  positionName: string;
  positionDescription: string;
  salary: number;
  status: EmploymentStatus;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface EmployeeRequest {
  userId: number;
  positionId: number;
  salary: number;
  hireDate: string;
  status: EmploymentStatus;
}
