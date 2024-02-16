import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AngularFireModule } from '@angular/fire/compat';  
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AuthGuard } from '@angular/fire/auth-guard';
import { LoginService } from '../autenticacion/services/login.service';
import { environment } from 'src/environments/environment';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './modal/modal.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    ModalComponent,
    ModalEditComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireAuthModule,  
    MatPaginatorModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [ AngularFireAuth, AuthGuard, LoginService], 
})
export class AdminModule { }
