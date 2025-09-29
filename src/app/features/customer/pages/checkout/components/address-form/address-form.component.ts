import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AddressCustomerRequest } from '../../../../../../core/models/address.model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  @Output() save = new EventEmitter<AddressCustomerRequest>();
  @Output() cancel = new EventEmitter<void>();

  // 👇 tipamos los controles
  form: FormGroup<{
    street: FormControl<string>;
    city: FormControl<string>;
    province: FormControl<string>;
    zipCode: FormControl<string>;
    reference: FormControl<string>;
  }>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      street: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      city: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      province: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      zipCode: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(/^[0-9]{5}$/)],
        nonNullable: true,
      }),
      reference: this.fb.control('', { nonNullable: true }),
    });
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.form.reset();
  }

  get f() {
    return this.form.controls;
  }
}
