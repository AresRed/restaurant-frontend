import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StoreResponse } from '../../../../../../../../core/models/store/store.model';
import { NotificationService } from '../../../../../../../../core/services/notification.service';
import { StoreService } from '../../../../../../../../core/services/restaurant/store.service';
import { CheckoutStep2Data } from '../../checkout-step-address.component';

@Component({
  selector: 'app-take-away-mode',
  imports: [ButtonModule, CommonModule, InputTextModule, FormsModule],
  templateUrl: './take-away-mode.component.html',
  styleUrl: './take-away-mode.component.scss',
})
export class TakeAwayModeComponent implements OnInit {
  @Output() next = new EventEmitter<CheckoutStep2Data>();
  @Output() back = new EventEmitter<void>();

  selectedStoreId: number | null = null;
  stores: StoreResponse[] = [];
  filteredStores: StoreResponse[] = [];
  searchTerm: string = '';

  constructor(
    private storeService: StoreService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    this.storeService.getAllStores().subscribe({
      next: (res) => {
        if (res.success) {
          this.stores = res.data;
          this.filteredStores = res.data;
        }
      },
      error: (err) => {
        this.notificationService.error('Error', err.message);
      },
    });
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStores = this.stores.filter((store) =>
      store.name.toLowerCase().includes(term)
    );
  }

  onNext() {
    if (!this.selectedStoreId) return;
    this.next.emit({ takeAway: { storeId: this.selectedStoreId } });
  }
}
