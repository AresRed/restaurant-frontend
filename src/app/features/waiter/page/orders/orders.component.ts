import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableResponse } from '../../../../core/models/table.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  // Propiedad para almacenar los datos de la mesa recibidos del diálogo
  tableData: TableResponse | null = null;

  constructor(
    public ref: DynamicDialogRef, // Referencia al propio diálogo
    public config: DynamicDialogConfig // Configuración y datos pasados al diálogo
  ) {}

  ngOnInit(): void {
    // Al iniciar el componente, obtenemos los datos de la mesa desde la configuración
    this.tableData = this.config.data.table;
  }

  /**
   * Cierra el diálogo actual.
   */
  closeDialog(): void {
    this.ref.close();
  }
}
