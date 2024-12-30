import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeDate'
})
export class SafeDatePipe implements PipeTransform {



  
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}