import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'; 


const routes: Routes = [ 
  { path: '', redirectTo: '/patient/home', pathMatch: 'full' },
  {
    path: 'panel',
    component: AdminComponent,
   // canActivate: [canActivate(() => redirectUnauthorizedTo(['/auth/login']))]
  },
  
 
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})


export class AdminRoutingModule { }
