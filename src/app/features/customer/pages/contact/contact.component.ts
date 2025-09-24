import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FloatLabel,
  ],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements AfterViewInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulario enviado', this.contactForm.value);
      alert('¡Mensaje enviado!');
      this.contactForm.reset();
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
}
