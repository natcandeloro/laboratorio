import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
interface Valor {
  position: number;
  nombre: string;
  dni: number;
  file: string;
  date: string;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})
export class AdminComponent {

  constructor ( private loginService: LoginService,
    private router: Router){ }
  async onClick(): Promise<void> {
    await this.loginService.logout();
    this.router.navigate(['/auth/login'])
    .catch(error => console.log(error)
    );
  }


valores: Valor[] = [
  {position: 1, nombre: 'Juan Gonzalez', dni: 32654654, date: '04/02/2024', file: 'pepe.pdf'},
  {position: 2, nombre: 'Pablo Perez', dni: 32654654, date: '',file: 'pepe.pdf' },
  {position: 3, nombre: 'Alex Perez', dni: 32654654, date: '',file: 'pepe.pdf' },
  {position: 4, nombre: 'Beryllium', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 5, nombre: 'Boron', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 6, nombre: 'Hydrogen', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 7, nombre: 'Helium', dni: 32654654, date: '', file: 'pepe.pdf' },
  {position: 8, nombre: 'Lithium', dni: 32654654, date: '',file: 'pepe.pdf' },
  {position: 9, nombre: 'Beryllium', dni: 32654654, date: '', file: 'pepe.pdf'},
  {position: 10, nombre: 'Boron', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 11, nombre: 'Hydrogen', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 12, nombre: 'Helium', dni: 32654654, date: '',file: 'pepe.pdf' },
  {position: 13, nombre: 'Lithium', dni: 32654654, date: '',file: 'pepe.pdf' },
  {position: 14, nombre: 'Beryllium', dni: 32654654, date: '',file: 'pepe.pdf'},
  {position: 15, nombre: 'Boron', dni: 32654654, date: '',file: 'pepe.pdf'},
];

pageSize = 10;
currentPage = 0;

get paginatedValores(): Valor[] {
  const startIndex = this.currentPage * this.pageSize;
  return this.valores.slice(startIndex, startIndex + this.pageSize);
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


