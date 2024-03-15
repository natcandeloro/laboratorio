import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
import { PanelService } from '../service/panel.service';
import { Storage } from '@angular/fire/storage';
import { Observable, Subscription, map } from 'rxjs';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';

interface Paciente {
  id: number;
  name: string;
  dni: number;
  file: string;
  date: string;
  lab: string;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})

export class AdminComponent implements OnInit, OnDestroy{
[x: string]: any;
  pacientes: any[] = [];
  pacientes$!: Observable<any[]>;
  documentosSubscription!:  Subscription;
  documentoId!: string;
  paciente: any;
  dni: string = '';
  name: string = '';
  lab: string = '';
  totalItems!: number;
  currentPage = 1; 
  itemsPerPage =  20;

  constructor ( private loginService: LoginService,
                private panelService: PanelService,
                private router: Router,
                private firestore: AngularFirestore){ 
                  this.pacientes$ = this.firestore.collection('pacientes').valueChanges();
  }

    ngOnInit(): void {
      this.panelService.obtenerDatos().subscribe(pacientes => {
        this.totalItems = pacientes.length;
        this.pacientes = pacientes;    });
    }

    cambiarPagina(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  
    // Método para calcular el número total de páginas
    get totalPages(): number {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    calcularIndices(): { startIndex: number, endIndex: number } {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
      let endIndex = startIndex + this.itemsPerPage - 1;
      if (endIndex > this.totalItems) {
        endIndex = this.totalItems;
      }
      return { startIndex, endIndex };
    }

  // Método para generar un array con las páginas
  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get pacientesEnPagina(): any[] {
    const { startIndex, endIndex } = this.calcularIndices();
    return this.pacientes.slice(startIndex - 1, endIndex);
  }

    // BUSCADOR POR DNI
    search(): void {
      let queryFn: QueryFn<any> = ref => ref; 
      if (this.dni !== '') {
        queryFn = ref => ref.where('dni', '==', this.dni);
      }
      this.pacientes$ = this.firestore.collection('pacientes', queryFn).valueChanges();
console.log()
    }
    
    // ELIMINA PACIENTE
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
      if (this.documentosSubscription) {
        this.documentosSubscription.unsubscribe();
      }
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


