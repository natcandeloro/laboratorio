import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class MaterialModule { }
