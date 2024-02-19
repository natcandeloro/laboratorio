import { Component } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
import { PanelService } from '../service/panel.service';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
[x: string]: any;
  pacientes: any[] = [];
  pacientes$!: Observable<any[]>;
  documentosSubscription: any;
  documentoId!: string;
  paciente: any

  constructor ( private loginService: LoginService,
                private panelService: PanelService,
                private router: Router,
                private storage: Storage,
                private firestore: AngularFirestore){ 
  }


    ngOnInit(): void {
    this.pacientes$ = this.panelService.obtenerDatos();
    this.pacientes$.subscribe(pacientes => {
        console.log('Documentos recibidos:', pacientes);
      });
    }

    eliminarPaciente(id: string, paciente: Paciente) {
      if (confirm('Está seguro de eliminar este paciente?')) {
        this.firestore.collection('pacientes').doc(id).delete()
          .then(() => {
            console.log('Paciente eliminado correctamente', id);
            this.pacientes = this.pacientes.filter(p => p.id !== id);
          })
          .catch(error => {
            console.error('Error al eliminar paciente:', error);
          });
      }
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
  

pageSize = 2;
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


