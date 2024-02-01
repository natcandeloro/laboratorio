import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LoginService } from '../../autenticacion/services/login.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})
export class AdminComponent implements AfterViewInit {

  constructor ( private loginService: LoginService,
    private router: Router){ }
  async onClick(): Promise<void> {
    await this.loginService.logout();
    this.router.navigate(['/auth/login'])
    .catch(error => console.log(error)
    );
  }

  displayedColumns: string[] = ['position', 'name', 'dni', 'file', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  file: number;
  dni: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', dni: 32654654, file: 1.0079},
  {position: 2, name: 'Helium', dni: 32654654, file: 4.0026 },
  {position: 3, name: 'Lithium', dni: 32654654, file: 6.941 },
  {position: 4, name: 'Beryllium', dni: 32654654, file: 9.0122},
  {position: 5, name: 'Boron', dni: 32654654,file: 10.811},

];

