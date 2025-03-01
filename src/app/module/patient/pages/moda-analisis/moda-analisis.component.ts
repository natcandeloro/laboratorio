import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-moda-analisis',
  templateUrl: './moda-analisis.component.html',
  styleUrl: './moda-analisis.component.css'
})
export class ModaAnalisisComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
