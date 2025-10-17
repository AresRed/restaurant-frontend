import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { OrderResponse } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/orders/order.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinnerModule, TooltipModule], 
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  googleMapsApiKey = environment.googleMapsApiKey;

  timelineSteps = ['Pendiente', 'Confirmada', 'En Progreso', 'Completada'];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrdersAuth().subscribe({
      next: (res) => {
        this.orders = res.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando órdenes', err);
        this.loading = false;
      },
    });
  }

  viewOrderDetail(orderId: number) {
    this.router.navigate(['/profile/orders', orderId]);
  }

  reorder(orderId: number) {
    console.log('Implementar lógica para reordenar la orden #', orderId);
  }

  getStepStatus(
    orderStatus: string,
    step: string
  ): 'completed' | 'current' | 'upcoming' {
    const orderIndex = this.timelineSteps.findIndex(
      (s) => s.toLowerCase() === orderStatus.toLowerCase()
    );
    const stepIndex = this.timelineSteps.indexOf(step);

    if (stepIndex < orderIndex) {
      return 'completed';
    }
    if (stepIndex === orderIndex) {
      return 'current';
    }
    return 'upcoming';
  }

  getStepIcon(step: string): string {
    switch (step) {
      case 'Pendiente':
        return 'pi pi-clock';
      case 'Confirmada':
        return 'pi pi-check';
      case 'En Progreso':
        return 'pi pi-spin pi-spinner';
      case 'Completada':
        return 'pi pi-flag-fill';
      default:
        return 'pi pi-circle';
    }
  }
}
