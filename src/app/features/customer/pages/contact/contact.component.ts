import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SendEmailRequest } from '../../../../core/models/email.model';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailService } from '../../../../core/services/email.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements AfterViewInit {
  contactForm: FormGroup;
  submitting = false;
  isAuthenticated = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAuthenticated = !!this.authService.currentUserValue;

    this.contactForm = this.fb.group({
      subject: [null, Validators.required],
      message: [null, Validators.required],
      phone: [null],
      name: [null],
      email: [null],
    });

    if (!this.isAuthenticated) {
      this.contactForm.get('name')?.setValidators([Validators.required]);
      this.contactForm
        .get('email')
        ?.setValidators([Validators.required, Validators.email]);
    } else {
      this.contactForm.get('name')?.clearValidators();
      this.contactForm.get('email')?.clearValidators();
    }

    this.contactForm.get('name')?.updateValueAndValidity();
    this.contactForm.get('email')?.updateValueAndValidity();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.notificationService.error(
        'Por favor completa todos los campos correctamente.'
      );
      return;
    }

    this.submitting = true;
    const formValue = this.contactForm.value;

    const request: SendEmailRequest = {
      subject: formValue.subject,
      message: formValue.message,
      phone: formValue.phone,
      ...(this.isAuthenticated
        ? {}
        : { name: formValue.name, email: formValue.email }),
    };

    this.emailService.sendEmail(request).subscribe({
      next: () => {
        this.notificationService.success('Mensaje enviado correctamente');
        this.contactForm.reset(
          {
            subject: null,
            message: null,
            phone: null,
            name: null,
            email: null,
          },
          { emitEvent: false }
        );
        this.submitting = false;
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error(
          'Error al enviar el mensaje. Intenta nuevamente.'
        );
        this.submitting = false;
      },
    });
  }

  get canSubmit() {
    return this.contactForm.valid && !this.submitting;
  }
}
