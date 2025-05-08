import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { RouterModule, Routes } from '@angular/router';
//import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'; 
import { GuardService } from './service/guard.service';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


const routes: Routes = [ 
  { path: '', redirectTo: '/patient/home', pathMatch: 'full' },
  {
    path: 'panel',
    component: AdminComponent,
    canActivate: [GuardService]
  },
  {
    path: 'estadisticas',
    component: EstadisticasComponent,
    canActivate: [GuardService]
  },
  
 
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})


export class AdminRoutingModule { }
