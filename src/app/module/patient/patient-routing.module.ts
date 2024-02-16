import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './Layout/layout.component';
import { AsComponent } from './pages/as/as.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PatientComponent } from './pages/patient/patient.component';
import { DescargaComponent } from './pages/descarga/descarga.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'nosotros', component: AsComponent },
      { path: 'pacientes', component: PatientComponent },
      { path: 'contacto', component: ContactComponent },
      { path: 'descarga', component: DescargaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
