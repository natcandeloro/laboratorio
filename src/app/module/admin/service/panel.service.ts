import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';

interface Paciente {
  id: number;
  nombre: string;
  DNI: number;
  file: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  private pacientesCollection: AngularFirestoreCollection<Paciente>;
  selectedFile: any;

  constructor( 
    private firestore: AngularFirestore,
    private storage: Storage    ) {
      this.pacientesCollection = this.firestore.collection<Paciente>('pacientes', ref => ref.orderBy('date'));
      ;
     }

  agregarDocumento(paciente: any) {
    return this.firestore.collection('pacientes').add(paciente);
  }

  obtenerDatos(): Observable<Paciente[]> {
    return this.pacientesCollection.valueChanges({ idField: 'id' });
  }

  eliminarPaciente(id: string){
    return this.firestore.collection('pacientes').doc(id).delete()
  }

  actualizarDocumento(idDocumento: string, nuevoDocumento: any): Promise<void> {
    return this.firestore.collection('pacientes').doc(idDocumento).set(nuevoDocumento, { merge: true });
  }

}
