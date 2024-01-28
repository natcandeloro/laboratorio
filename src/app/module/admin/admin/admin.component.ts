import { Component } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor ( private loginService: LoginService,
    private router: Router){ }
  async onClick(): Promise<void> {
    await this.loginService.logout();
    this.router.navigate(['/auth/login'])
    .catch(error => console.log(error)
    );
  }
}
