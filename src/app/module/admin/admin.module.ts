import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AngularFireModule } from '@angular/fire/compat';  // Import AngularFireModule
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Import AngularFireAuthModule
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AuthGuard } from '@angular/fire/auth-guard';
import { LoginService } from '../autenticacion/services/login.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),  // Initialize AngularFireModule with your Firebase config
    AngularFireAuthModule,  
  ],
  providers: [ AngularFireAuth, AuthGuard, LoginService], 
})
export class AdminModule { }
