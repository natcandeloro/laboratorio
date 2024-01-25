import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { PatientRoutingModule } from './patient-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './layout.module';
import { AsComponent } from './pages/as/as.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PatientComponent } from './pages/patient/patient.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    HomeComponent,
    AsComponent,
    ContactComponent,
    PatientComponent,

  ],
  
  imports: [
    CommonModule,
    PatientRoutingModule,
    NgbModule,
    LayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ]
})
export class PatientModule { }
