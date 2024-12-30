import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
  fechaDeCarga: string = '';
  totalItems!: number;
  currentPage = 1; 
  itemsPerPage =  20;
  errorMessage: boolean = false;
  private searchSubject = new Subject<string>();
 

  resultados: any[] = [];
  fechaBusqueda: string = '';

  constructor ( private loginService: LoginService,
                private panelService: PanelService,
                private router: Router,
                private firestore: AngularFirestore){ 
                  this.pacientes$ = this.firestore.collection('pacientes').valueChanges();
  } 

    refrescar(): void {
      this.panelService.obtenerDatos().subscribe(pacientes => {
        this.totalItems = pacientes.length;
        this.pacientes = this.ordenarPorFechaDeCarga(pacientes); // Aplica la ordenación
        console.log(this.pacientes);
        this.currentPage = 1; // Resetea a la página 1
      });
    }
    
   ordenarPorFechaDeCarga(pacientes: any[]): any[] {
      // Filtra los pacientes con fecha de carga
      const conFecha = pacientes.filter(p => p.fechaDeCarga).sort((a, b) => {
        // Ordena por fecha de carga de manera descendente
        return new Date(b.fechaDeCarga).getTime() - new Date(a.fechaDeCarga).getTime();
      });
      
      // Filtra los pacientes sin fecha de carga
      const sinFecha = pacientes.filter(p => !p.fechaDeCarga);
      
      // Combina los arrays, poniendo los pacientes con fecha primero
      return [...conFecha, ...sinFecha];
    }
    

      ngOnInit(): void {
        this.panelService.obtenerDatos().subscribe(pacientes => {
          this.totalItems = pacientes.length;
          this.pacientes = this.ordenarPorFechaDeCarga(pacientes);
          console.log(this.pacientes);
        });

        this.searchSubject.pipe(
          debounceTime(300)  // Espera 300ms después del último evento
        ).subscribe(dni => {
          this.search();
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

      // Método para generar un array con las páginas visibles
  get paginas(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, this.currentPage - half);
    let endPage = Math.min(this.totalPages, this.currentPage + half);

    if (this.currentPage <= half) {
      endPage = Math.min(this.totalPages, maxVisiblePages);
    }

    if (this.currentPage + half >= this.totalPages) {
      startPage = Math.max(1, this.totalPages - maxVisiblePages + 1);
    }

    const paginasVisibles = [];
    for (let i = startPage; i <= endPage; i++) {
      paginasVisibles.push(i);
    }

    return paginasVisibles;
  }

  get pacientesEnPagina(): any[] {
    const { startIndex, endIndex } = this.calcularIndices();
    return this.pacientes.slice(startIndex - 1, endIndex);
  }

    // BUSCADOR POR DNI
    search(): void {
      let queryFn: QueryFn<any> = ref => ref; 
      if (this.dni.trim() !== '') {
        queryFn = ref => ref.where('dni', '==', this.dni.trim());
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
  
        if (this.pacientes.length === 0) {
          this.errorMessage = true;
          this.pacientes = []; 
        } else {
          this.errorMessage = false;
        }
  
        this.currentPage = 1; // Resetea a la página 1
      });
    }
    
    searchName(): void {
      const searchValue = this.name.trim().toLowerCase();
    
      if (!searchValue) {
        console.warn('El valor de búsqueda está vacío. No se aplicará ningún filtro.');
        this.pacientes = []; // O decide qué hacer si el valor está vacío.
        return;
      }
    
      this.firestore.collection('pacientes').snapshotChanges().subscribe(pacientes => {
        this.pacientes = pacientes.map(paciente => {
          const data = paciente.payload.doc.data() as Paciente; // Especifica el tipo de datos
          const id = paciente.payload.doc.id;
          if (data && typeof data === 'object') {
            return { id, ...data };
          } else {
            console.error('Los datos del paciente no son un objeto válido:', data);
            return null;
          }
        }).filter(paciente => {
          if (paciente !== null) {
            const name = (paciente.name || '').toLowerCase();
            return name.startsWith(searchValue);
          }
          return false;
        });
    
        console.log(this.pacientes);
        this.currentPage = 1; // Resetea a la página 1
      });
    }

    searchByFechaDeCarga(): void {
      if (this.fechaDeCarga.trim() !== '') {
        const [year, month, day] = this.fechaDeCarga.split('-');
        const startDate = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0); // Inicio del día
        const endDate = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999); // Fin del día
    
        let queryFn: QueryFn<any> = ref => 
          ref.where('fechaDeCarga', '>=', startDate.toISOString())
             .where('fechaDeCarga', '<=', endDate.toISOString());
    
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
    
          if (this.pacientes.length === 0) {
            this.errorMessage = true;
            this.pacientes = []; 
          } else {
            this.errorMessage = false;
          }
    
          this.currentPage = 1; // Resetea a la página 1
        });
      }
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


