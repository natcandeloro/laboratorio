import { Injectable } from '@angular/core';
import {  signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 


@Injectable({
  providedIn: 'root',

})

export class LoginService {

  
  constructor( private afAuth: AngularFireAuth){}

  login({ usuario, password}: any){
    return this.afAuth.signInWithEmailAndPassword(usuario, password)
  }

  logout(){
    return this.afAuth.signOut(); 
  }

  async enviarCorreoRecuperacion(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo electrónico de recuperación enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar correo electrónico de recuperación:', error);
    }
  }
}
