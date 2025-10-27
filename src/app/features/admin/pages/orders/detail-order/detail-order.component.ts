import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { environment } from '../../../../../../environments/environment';
import { OrderResponse } from '../../../../../core/models/order.model';
import { OrderService } from '../../../../../core/services/orders/order.service';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ProgressSpinnerModule,
    RouterModule,
    Button,
  ],
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit {
  order!: OrderResponse;
  loading = true;
  googleMapsKey = environment.googleMapsApiKey;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) this.loadOrder(orderId);
    else this.loading = false;
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la orden:', err);
        this.loading = false;
      },
    });
  }
}
