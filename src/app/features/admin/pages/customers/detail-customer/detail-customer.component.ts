import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { CustomerResponse } from '../../../../../core/models/customer/customer.model';
import { CustomerService } from '../../../../../core/services/customer/customerhttp/customer.service';
import { RoleLabelPipe } from '../../../../../shared/pipes/role-label.pipe';

@Component({
  selector: 'app-detail-customer',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    ProgressSpinnerModule,
    RoleLabelPipe
  ],
  templateUrl: './detail-customer.component.html',
  styleUrl: './detail-customer.component.scss',
})
export class DetailCustomerComponent implements OnInit {
  customer?: CustomerResponse;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.customerService.getCustomerById(id).subscribe({
      next: (res) => {
        this.customer = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/customers']);
  }
}
