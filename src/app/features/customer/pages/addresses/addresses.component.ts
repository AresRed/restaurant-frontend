import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { take } from 'rxjs';
import {
  AddressCustomerRequest,
  AddressResponse,
} from '../../../../core/models/address.model';
import { ConfirmService } from '../../../../core/services/confirmation.service';
import { AddressService } from '../../../../core/services/customer/address/address.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
})
export class AddressesComponent implements OnInit, AfterContentChecked {
  addresses: AddressResponse[] = [];
  isEditing = false;
  editingAddressId: number | null = null;
  addressForm: FormGroup;

  constructor(
    private addressService: AddressService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private confirmationService: ConfirmService,
    private cdr: ChangeDetectorRef
  ) {
    this.addressForm = this.fb.group({
      street: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255),
        ],
      ],
      reference: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required, Validators.maxLength(100)]],
      zipCode: ['', [Validators.maxLength(20)]],
      instructions: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  get f() {
    return this.addressForm.controls;
  }

  loadAddresses() {
    this.addressService
      .getAllAddressAuth()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.addresses = res.data.content;
          this.cdr.detectChanges();
        },
        error: () => {
          this.notificationService.error('Error al cargar las direcciones');
        },
      });
  }

  newAddress() {
    this.isEditing = true;
    this.editingAddressId = null;
    this.addressForm.reset({
      street: '',
      reference: '',
      city: '',
      province: '',
      zipCode: '',
      instructions: '',
    });
    this.cdr.detectChanges();
  }

  startEdit(address: AddressResponse) {
    this.isEditing = true;
    this.editingAddressId = address.id;

    this.addressForm.patchValue({
      street: address.street || '',
      reference: address.reference || '',
      city: address.city || '',
      province: address.province || '',
      zipCode: address.zipCode || '',
      instructions: address.instructions || '',
    });

    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingAddressId = null;
    this.addressForm.reset({
      street: '',
      reference: '',
      city: '',
      province: '',
      zipCode: '',
      instructions: '',
    });
    this.cdr.detectChanges();
  }

  saveAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const payload: AddressCustomerRequest = this.addressForm.value;

    if (this.editingAddressId) {
      this.addressService
        .updateAddressAuth(this.editingAddressId, payload)
        .subscribe({
          next: () => {
            this.notificationService.success(
              'Dirección actualizada correctamente'
            );
            this.loadAddresses();
            this.cancelEdit();
          },
          error: () =>
            this.notificationService.error('Error al actualizar la dirección'),
        });
    } else {
      this.addressService.addAddressAuth(payload).subscribe({
        next: () => {
          this.notificationService.success('Dirección agregada correctamente');
          this.loadAddresses();
          this.cancelEdit();
        },
        error: () =>
          this.notificationService.error('Error al agregar la dirección'),
      });
    }
  }

  async confirmDelete(event: Event, id: number) {
    const confirmed = await this.confirmationService.confirm(
      {
        message: '¿Deseas eliminar esta dirección?',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
      },
      event
    );
    if (confirmed) {
      this.deleteAddress(id);
    }
  }

  private deleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe({
      next: () => {
        this.notificationService.success('Dirección eliminada correctamente');
        this.loadAddresses();
      },
      error: () =>
        this.notificationService.error('Error al eliminar la dirección'),
    });
  }
}
