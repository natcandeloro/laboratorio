import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
    path: 'patient', //TODO: localHost:4200/company
    loadChildren: () => import('./module/patient/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'auth', //TODO: localHost:4200/auth
    loadChildren: () => import('./module/autenticacion/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin', //TODO: localHost:4200/admin
    loadChildren: () => import('./module/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**', //TODO: No existe te envio a la ruta arriba login
    redirectTo: 'patient',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
