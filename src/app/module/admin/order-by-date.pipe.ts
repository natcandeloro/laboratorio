import { Pipe, PipeTransform } from '@angular/core';

interface Paciente {
  fechaDeCarga: string;
  name: string;
  dni: number;
  file: string;
  date: string;
  lab: string;
}

@Pipe({
  name: 'orderByDate',
})
export class OrderByDatePipe implements PipeTransform {

  transform(pacientes: Paciente[]): Paciente[] {
    const conFecha = pacientes.filter(p => p.fechaDeCarga).sort((a, b) => {
      return new Date(a.fechaDeCarga!).getTime() - new Date(b.fechaDeCarga!).getTime();
    });

    const sinFecha = pacientes.filter(p => !p.fechaDeCarga);

    return [...conFecha, ...sinFecha];
  }

}
