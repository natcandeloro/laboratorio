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
import { MaterialModule } from '../material/material.module';
import { ModalComponent } from './modal/modal.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { FormatDatePipe } from '../admin/format-date.pipe';
@NgModule({
  declarations: [
    AdminComponent,
    ModalComponent,
    ModalEditComponent,
    FormatDatePipe,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireAuthModule,  
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [ AngularFireAuth, AuthGuard, LoginService], 
})
export class AdminModule { }
