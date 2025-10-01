import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';


import { } from 'primeng/iconfield';
import { UbicationService } from '../../../../core/services/ubication.service';

@Component({
  selector: 'app-ubication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    SelectButton,
    SelectButtonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    FloatLabelModule,
    InputIconModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './ubication.component.html',
  styleUrl: './ubication.component.scss'
})
export class UbicationComponent implements OnInit, OnDestroy {

  displayDialog: boolean = false;
  private subscription: any;

  constructor(private ubicationService: UbicationService) { }
  ngOnInit(): void {
    this.subscription = this.ubicationService.dialogState$.subscribe(open => {
      this.displayDialog = open;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  stateOptions: any[] = [
    { label: 'Delivery', value: 'delivery' },
    { label: 'Retiro', value: 'retiro' },
  ];

  value: string = 'delivery';
  ubicacionLocal: string = ' Av San Martin 1149, Ica 11001 Horarios: 12 p. m.–12 a. m.'

  
  onSelectionChange(event: any) {
    console.log('Opción seleccionada:', this.value);

  }





}
