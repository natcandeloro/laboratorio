import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
import { PanelService } from '../service/panel.service';
import { Observable, Subscription, map } from 'rxjs';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';

interface Paciente {
  fechaDeCarga: string;
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
  errorMessage: boolean = false;

  constructor ( private loginService: LoginService,
                private panelService: PanelService,
                private router: Router,
                private firestore: AngularFirestore){ 
                  this.pacientes$ = this.firestore.collection('pacientes').valueChanges();
  }
  ordenarPorFechaDeCarga(pacientes: any[]): any[] {
    // Filtra los pacientes con fecha de carga
    const conFecha = pacientes.filter(p => p.fechaDeCarga);
    // Filtra los pacientes sin fecha de carga
    const sinFecha = pacientes.filter(p => !p.fechaDeCarga);
    // Combina los arrays, poniendo los pacientes con fecha primero
    return [...conFecha, ...sinFecha];
  }

/*    ngOnInit(): void {
     this.panelService.obtenerDatos().subscribe(pacientes => {
        this.totalItems = pacientes.length;
        this.pacientes = pacientes;   
      console.log(pacientes) });
    }*/

      ngOnInit(): void {
        this.panelService.obtenerDatos().subscribe(pacientes => {
          this.totalItems = pacientes.length;
          this.pacientes = this.ordenarPorFechaDeCarga(pacientes);
          console.log(this.pacientes);
        });
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
      const data: unknown = {};
      let queryFn: QueryFn<any> = ref => ref; 
      if (this.dni !== '') {
        queryFn = ref => ref.where('dni', '==', this.dni);
      }
      this.firestore.collection('pacientes', queryFn).snapshotChanges().subscribe(pacientes => {
        this.pacientes = pacientes.map(paciente => {
          const data = paciente.payload.doc.data();
          const id = paciente.payload.doc.id;
          if (typeof data === 'object' && data !== null) {
            return { id, ...data };
          } else {
            console.error('Los datos del paciente no son un objeto válido:', data);
            return null; 
          }
        }).filter(paciente => paciente !== null);
        console.log(this.pacientes);
        if (this.pacientes.length === 0) {
          this.errorMessage = true;
          this.pacientes = []; 
        } else {
          this.errorMessage = false;
        }
      });
    };

    refrescar(): void {
      this.panelService.obtenerDatos().subscribe(pacientes => {
        this.totalItems = pacientes.length;
        this.pacientes = pacientes;
        console.log(pacientes);
      });
    }
    
    searchLab(): void {
      const data: unknown = {};
      let queryFn: QueryFn<any> = ref => ref; 
      if (this.lab !== '') {
        queryFn = ref => ref.where('lab', '==', this.lab);
      }
      this.firestore.collection('pacientes', queryFn).snapshotChanges().subscribe(pacientes => {
        this.pacientes = pacientes.map(paciente => {
          const data = paciente.payload.doc.data();
          const id = paciente.payload.doc.id;
          if (typeof data === 'object' && data !== null) {
            return { id, ...data };
          } else {
            console.error('Los datos del paciente no son un objeto válido:', data);
            return null; 
          }
        }).filter(paciente => paciente !== null);
        console.log(this.pacientes);
      });
    };
    
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


