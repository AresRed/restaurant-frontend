import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { InventoryDetailResponse } from '../../../../../core/models/products/inventory/inventory.model';
import { InventoryService } from '../../../../../core/services/products/inventory/inventory.service';

@Component({
  selector: 'app-detail-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    CardModule,
    TagModule,
    ProgressBarModule,
    DividerModule,
    RouterModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './detail-inventory.component.html',
  styleUrls: ['./detail-inventory.component.scss'],
})
export class DetailInventoryComponent implements OnInit {
  inventoryDetail!: InventoryDetailResponse;
  loading = true;

  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getInventoryDetail(id);
  }

  getInventoryDetail(id: number) {
    this.inventoryService.getInventoryById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.inventoryDetail = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/inventory']);
  }

  getSourceLabel(source: string): string {
    switch (source) {
      case 'PURCHASE':
        return 'Compra';
      case 'ORDER':
        return 'Orden';
      case 'SALE':
        return 'Venta';
      case 'MANUAL':
        return 'Manual';
      default:
        return 'Otro';
    }
  }

  getSourceSeverity(
    source: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (source) {
      case 'PURCHASE':
        return 'info';
      case 'ORDER':
        return 'warn';
      case 'SALE':
        return 'danger';
      case 'MANUAL':
        return 'secondary';
      default:
        return 'contrast';
    }
  }
}
