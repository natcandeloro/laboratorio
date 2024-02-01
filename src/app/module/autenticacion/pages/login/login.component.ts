import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formlogin: FormGroup;

 constructor(private loginService: LoginService,
              private router: Router){
                this.formlogin = new FormGroup({
                  usuario: new FormControl(),
                  password: new FormControl(),
                })
 }
 onSubmit(){
    this.loginService.login(this.formlogin.value)
    .then(response => {
console.log(response);
this.router.navigate(['/admin/panel']);
    })
    .catch(error=> 
      alert("Error al loguearse: " + error )
    )
  }
}