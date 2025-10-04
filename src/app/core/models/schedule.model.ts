export enum DayOfWeekEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface ScheduleRequest {
  employeeId: number;
  dayOfWeek: DayOfWeekEnum;
  startTime: string;
  endTime: string;
}

export interface ScheduleResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  positionName: string;
  dayOfWeek: DayOfWeekEnum;
  startTime: string;
  endTime: string;
}
