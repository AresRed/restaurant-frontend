export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
}

export interface EmployeeResponse {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl: string;
  phone: string;
  
  positionId: number;
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
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password?: string;

  positionId: number;
  salary: number;
  hireDate: string;
  status: EmploymentStatus;
}