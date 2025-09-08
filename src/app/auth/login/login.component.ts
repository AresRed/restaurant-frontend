import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { UiService } from '../../services/ui.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from "primeng/floatlabel"
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    FloatLabelModule

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  //variables para la tab de login/register
  visible: boolean = false;
  activeTab: 'login' | 'register' = 'login';

  //variables para login
  loginEmail: string = '';
  loginPassword: string = '';

  //variables para register
  nombre: string = '';
  regEmail: string = '';
  regPassword = '';
  regPasswordConfirm: string = '';


  //constructor 
  constructor(

    // variable para el uso de metodos del servicio uiservice del servicio de despliegue
    private uiService: UiService,

    // variable para el uso de metodos del servicio authservice para el consumo de api's
    private authService: AuthService,

  ) { }
  //metodo para la asignacion de la funcion de despliegue del login/observer
  ngOnInit() {
    this.uiService.loginDrawerState$.subscribe(state => {
      this.visible = state
    })
  }

  // Método de login
  onLogin(form: NgForm) {
    if (!form.valid) return;

    this.authService.login({
      usernameOrEmail: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: res => {
        console.log('Login exitoso', res);
        // Guardar token en localStorage si quieres
        localStorage.setItem('accessToken', res.accessToken);
        this.visible = false; // cerrar drawer al iniciar sesión
      },
      error: err => {
        console.error('Error al iniciar sesión', err);
      }
    });
  }

  // Método de registro
  onRegister(form: NgForm) {
    if (!form.valid) return;

    if (this.regPassword !== this.regPasswordConfirm) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    this.authService.register({
      username: this.nombre,
      email: this.regEmail,
      password: this.regPassword
    }).subscribe({
      next: res => {
        console.log('Registro exitoso', res);
        this.activeTab = 'login'; // cambiar al login tras registrarse
      },
      error: err => {
        console.error('Error al registrar', err);
      }
    });
  }
}
