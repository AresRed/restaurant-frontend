import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { Router } from '@angular/router';
import { UbicationService } from '../../../../core/services/ubication.service';
import { AuthService } from '../../../../core/services/auth.service';
import { InputNumber } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ICA_DISTRICTS } from './IcaDistricts';


@Component({
  selector: 'app-ubication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    SelectButtonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    FloatLabelModule,
    InputIconModule,
    CommonModule,
    ButtonModule,
    NgIf,
    InputTextarea,
    InputNumber,
    DropdownModule
],
  templateUrl: './ubication.component.html',
  styleUrl: './ubication.component.scss'
})

export class UbicationComponent implements OnInit, OnDestroy {

  displayDialog: boolean = false;
  private subscription: any;
   districts: any[] = ICA_DISTRICTS;
  private readonly city = 'Ica'; 

  addressForm!: FormGroup;

  stateOptions: any[] = [
    { label: 'Delivery', value: 'delivery' },
    { label: 'Retiro', value: 'retiro' },
  ];
  value: string = 'delivery';
  ubicacionLocal: string = 'Av San Martin 1149, Ica 11001 Horarios: 12 p. m.–12 a. m.';

  constructor(
    private ubicationService: UbicationService,
    private fb: FormBuilder,
    private authService: AuthService,    
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.ubicationService.dialogState$.subscribe(open => {
      this.displayDialog = open;
    });


    this.addressForm = this.fb.group({
      street: ['', ],
      reference: ['', ],
      city: [{value: this.city,disabled: true}],
      distrito: [null],
      zipCode: ['' ],
      instructions: [''],
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get f() {
    return this.addressForm.controls;
  }

  onSelectionChange(event: any) {
    console.log('Opción seleccionada:', this.value);
  }

  saveAddress() {


    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;

      this.ubicationService.createAddress(addressData).subscribe({
        next: (response) => {

          this.displayDialog = false;
          this.addressForm.reset();
        },
        error: (err) => console.error('Error al guardar la direccion')

      });
    } else {
      this.addressForm.markAllAsTouched();
    }


  }
}