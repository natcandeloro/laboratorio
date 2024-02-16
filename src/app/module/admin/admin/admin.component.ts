import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
import { PanelService } from '../service/panel.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { Observable, first, map } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FieldValue, QueryDocumentSnapshot } from '@angular/fire/firestore';

interface Paciente {
  id: number;
  nombre: string;
  DNI: number;
  file: string;
  date: string;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})
export class AdminComponent {
  pacientes: any[] = [];
  documentos$!: Observable<any[]>;
  documentos: any[] = []; 
  documentosSubscription: any;
  documentoId!: string;


  constructor ( private loginService: LoginService,
                private panelService: PanelService,
                private router: Router,
                private storage: Storage,
                private firestore: AngularFirestore
                ){ 
                  this.documentos$ = this.firestore.collection('pacientes').snapshotChanges()
                  .pipe(
                    map(documentos => {
                      return documentos.map(documento => {
                        console.log('Documento:', documento);
                        const id = documento.payload.doc.id;
                        const data = documento.payload.doc.data();
                        console.log('ID:', id);
                        console.log('Datos:', data);
                        if (!id || !data) {
                          console.error('Documento no tiene el formato esperado:', documento);
                          return null; 
                        }
                        return { id, ...data };
                      }).filter(documento => documento !== null); 
                    })
                  );
                }


    ngOnInit(): void {
    this.documentos$ = this.panelService.obtenerDatos();

   this.documentos$.subscribe(documentos => {
        console.log('Documentos recibidos:', documentos);
      });
    //  this.getDocs();
    }

    eliminarPaciente(id: string) {
      console.log(id)
      this.firestore.collection('pacientes').doc(id).delete()
        .then(() => {
          console.log('Documento eliminado correctamente');
        })
        .catch(error => {
          console.error('Error al eliminar documento:', error);
        });
    }

    ngOnDestroy(): void {
      this.documentosSubscription.unsubscribe();
    }

  async onClick(): Promise<void> {
    await this.loginService.logout();
    this.router.navigate(['/auth/login'])
    .catch(error => console.log(error)
    );
  }

  obtenerPacientes() {
    this.panelService.obtenerDatos().subscribe(datos => {
      
      console.log('Datos obtenidos:', datos);
    });
    
  }
  

  getDocs(){
    const docsRef = ref(this.storage, 'pacientesdocs')

    listAll(docsRef)
    .then(async response => {
      console.log(response)
      for (let item of response.items) {
        const url = await getDownloadURL(item);
        console.log(url);
      }
    })
    .catch(error => 
      alert("Error al loguearse: " + error ),
      )
  }
  

pageSize = 10;
currentPage = 0;

get paginatedValores(): Paciente[] {
  const startIndex = this.currentPage * this.pageSize;
  return this.pacientes.slice(startIndex, startIndex + this.pageSize);
}

/*  MODAL */
modalVisible = false;
  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
  closeModal() {
    this.modalVisible = false;
  }
 /* MODAL EDIT */ 
  modalVisibleEdit = false;

  toggleModalEdit() {
    this.modalVisibleEdit = !this.modalVisibleEdit;
  }
  closeModalEdit() {
    this.modalVisibleEdit = false;
  }
}


