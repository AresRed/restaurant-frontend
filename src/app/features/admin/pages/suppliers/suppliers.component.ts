import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SupplierResponse } from '../../../../core/models/supplier.model';
import { SupplierService } from '../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-suppliers',
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    FormsModule,
    ToggleButtonModule,
    AvatarModule,
    ButtonModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
})
export class SuppliersComponent implements OnInit {
  suppliers: SupplierResponse[] = [];
  showTable = false;
  filter: string = '';

  constructor(private supplierService: SupplierService) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((res) => {
      if (res.success) this.suppliers = res.data;
    });
  }

  filteredSuppliers() {
    if (!this.filter) return this.suppliers;
    const lower = this.filter.toLowerCase();
    return this.suppliers.filter(
      (s) =>
        s.companyName.toLowerCase().includes(lower) ||
        s.contactName.toLowerCase().includes(lower)
    );
  }

  viewDetails(supplier: any) {
    console.log('Ver detalle', supplier);
  }

  editSupplier(supplier: any) {
    console.log('Editar', supplier);
  }
}
