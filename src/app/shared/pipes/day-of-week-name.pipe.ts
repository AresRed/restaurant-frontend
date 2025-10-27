import { Pipe, PipeTransform } from '@angular/core';
import { DayOfWeekEnum } from '../../core/models/schedule.model';

@Pipe({
  name: 'dayOfWeekName',
  standalone: true,
})
export class DayOfWeekNamePipe implements PipeTransform {
  private readonly dayNamesMap: Record<DayOfWeekEnum, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  transform(value: DayOfWeekEnum | string): string {
    return this.dayNamesMap[value as DayOfWeekEnum] || value;
  }
}
