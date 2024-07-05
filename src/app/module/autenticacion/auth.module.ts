import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from '../material/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginService } from './services/login.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from './pages/password/password/password.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@NgModule({
  declarations: [
    LoginComponent,
    PasswordComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [LoginService, AngularFireAuth],
})
export class AuthModule { }
