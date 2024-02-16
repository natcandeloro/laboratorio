export class Paciente {
    name: string;
    dni: string;
    date: string;
    file: string;
    id: string;
  
    constructor(name: string, dni: string, date: string, file: string, id: string) {
      this.name = name;
      this.dni = dni;
      this.date = date;
      this.file = file;
      this.id = id; 
    }
  }
  