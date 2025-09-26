import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private uiService: UiService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');

    if (code) {
      this.http
        .get(`http://localhost:8080/api/v1/auth/verify?code=${code}`, {
          responseType: 'text',
        })
        .subscribe({
          next: (res) => {
            this.status = 'success';
            this.message = res;
          },
          error: (err) => {
            this.status = 'error';
            this.message = err.error || 'Error verificando el correo';
          },
        });
    } else {
      this.status = 'error';
      this.message = 'Código no encontrado en el enlace';
    }
  }

  openLogin() {
    this.uiService.openLogin();
  }
}
