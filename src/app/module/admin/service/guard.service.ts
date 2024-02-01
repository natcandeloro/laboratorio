import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import {  canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'; 
import { Observable, map, tap, take } from 'rxjs';
import { LoginService } from '../../autenticacion/services/login.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private readonly router: Router,
    private afAuth: AngularFireAuth) {}

    canActivate(): Observable<boolean> {
      return this.afAuth.authState.pipe(
        take(1),
        map(user => {
          if (user) {
            return true;
          } else {
            this.router.navigate(['/auth/login']);
            return false;
          }
        })
      );
    }
    
  }
    



