import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DeliveryAddressRequest } from '../../../../../../core/models/order.model';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnChanges {
  @Input() initialData: Partial<DeliveryAddressRequest> | null = null;
  @Output() addressChange = new EventEmitter<Partial<DeliveryAddressRequest>>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      street: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      province: [{ value: '', disabled: true }],
      zipCode: [{ value: '', disabled: true }],
      reference: [''],
      instructions: [''],
    });

    this.form.valueChanges.subscribe(() => {
      this.addressChange.emit(this.form.getRawValue());
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.form.patchValue(this.initialData, { emitEvent: false });
    }
  }
}
