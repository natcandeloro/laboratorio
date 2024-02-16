import { Injectable, Inject } from '@angular/core';
import { AngularFirestore  } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Paciente } from '../admin/model';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class PanelService {
  selectedFile: any;

  constructor( 
    private firestore: AngularFirestore,
    private storage: Storage    ) { }

  agregarDocumento(paciente: any) {
    return this.firestore.collection('pacientes').add(paciente);
  }

  obtenerDatos() {
    return this.firestore.collection('pacientes').valueChanges();
  }

  eliminarPaciente(id: string){
    return this.firestore.collection('pacientes').doc(id).delete()
  }

  actualizarDocumento(idDocumento: string, nuevoDocumento: any): Promise<void> {
    return this.firestore.collection('pacientes').doc(idDocumento).set(nuevoDocumento, { merge: true });
  }

}
