import { Pipe, PipeTransform } from '@angular/core';
import { roleLabels, Roles } from '../../core/models/base/roles.model';

@Pipe({
  name: 'roleLabel',
})
export class RoleLabelPipe implements PipeTransform {
  transform(value: Roles[] | Roles): string | undefined {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      return value.map((role) => roleLabels[role]).join(', ');
    }
    return roleLabels[value];
  }
}
