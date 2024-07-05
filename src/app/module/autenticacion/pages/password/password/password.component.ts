import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  email: string = '';

  constructor(private loginService: LoginService,
    private router: Router) {}

  async recuperarContrasena(): Promise<void> {
    try {
      await this.loginService.enviarCorreoRecuperacion(this.email);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al enviar correo electrónico de recuperación:', error);
    }
  }
  
}
