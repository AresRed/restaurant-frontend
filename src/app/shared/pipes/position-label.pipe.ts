import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'positionLabel',
})
export class PositionLabelPipe implements PipeTransform {
  private readonly positionLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    WAITER: 'Mesero',
    CHEF: 'Cocinero',
    SUPPLIER: "Proveedor",
    CLIENT: "Cliente",
    CASHIER: "Cajero",
  };

  transform(value: string): string {
    if (!value) return '';
    return this.positionLabels[value] || this.capitalize(value);
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
