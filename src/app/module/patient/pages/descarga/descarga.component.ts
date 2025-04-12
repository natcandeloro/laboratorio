import { Component, OnInit } from '@angular/core';
import { AngularFirestore, QueryFn} from '@angular/fire/compat/firestore';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';

interface Paciente {
  id: number;
  nombre: string;
  dni: string;
  file: string;
  date: string;
  required: boolean;
}

@Component({
  selector: 'app-descarga',
  templateUrl: './descarga.component.html',
  styleUrl: './descarga.component.css'
})

export class DescargaComponent implements OnInit {

  fileURL!: string;
  dniControl: any;
  formGroup!: FormGroup;
  dni = '';
  showError: boolean = false;
  errorMessage: string = '';
  pacientes$!: Observable<any[]>;

  constructor(private firestore: AngularFirestore,
    private formBuilder: FormBuilder,) {
      // this.pacientes$ = this.firestore.collection('pacientes').valueChanges();
    }

  ngOnInit() {
        this.formGroup = new FormGroup({
  dni: new FormControl('', [
    Validators.required,
    Validators.minLength(7),
    Validators.maxLength(9),
    Validators.pattern('[a-zA-Z0-9]*'),
  ]),
});
}

descargarArchivo() {
  const dniControl = this.formGroup.get('dni');
  const errors = dniControl?.errors || {}; // Si errors es null, asigna un objeto vacío

  console.log('DNI antes de la consulta:', this.formGroup.controls['dni'].value);
  if (!this.formGroup.valid) {
      console.error('Formulario no válido');
      return;
  }
  this.firestore.collection('pacientes').ref.where('dni', '==', this.formGroup.controls['dni'].value).get().then(querySnapshot => {
      if (querySnapshot.empty) {
          console.error('No se encontró ningún paciente con el DNI proporcionado');
          const mensajeErrorElement = document.createElement('div');
          mensajeErrorElement.innerText = 'No se encontró ningún paciente con el DNI proporcionado';
          mensajeErrorElement.style.color = 'red'; // Establece el color de texto en rojo para indicar un error
          document.getElementById('errorCard')?.appendChild(mensajeErrorElement); // Agrega el mensaje de error a la caja de error
          return;
      }
      const pacienteData = querySnapshot.docs[0].data() as Paciente;
      const paciente = pacienteData as Paciente;
      const fileURL = pacienteData.file;
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `documento_${this.dni}.pdf`;
      link.click();
  }).catch(error => {
      console.error('Error al buscar el paciente:', error);
      this.mostrarMensajeError('Ocurrió un error al buscar el paciente');
  });
}
  mostrarMensajeError(arg0: string) {
    throw new Error('Method not implemented.');
  }
 
  search(): void {
    let queryFn: QueryFn<any> = ref => ref;
    
    if (this.dni !== '') {
      queryFn = ref => ref.where('dni', '==', this.dni);
    }
    
    // Obtenemos los datos y los ordenamos por fecha (más recientes primero)
    this.pacientes$ = this.firestore.collection('pacientes', queryFn)
      .valueChanges()
      .pipe(
        map((pacientes: any[]) => {
          // Depurar las fechas que llegan de la base de datos
          console.log('Fechas originales de la base de datos:');
          pacientes.forEach(p => {
            console.log(`Fecha original: ${p.date}, Tipo: ${typeof p.date}`);
          });
          
          return pacientes.sort((a: any, b: any) => {
            // Verificar si los objetos y la propiedad date existen
            const fechaA = typeof a === 'object' && a !== null && 'date' in a ? a.date : '';
            const fechaB = typeof b === 'object' && b !== null && 'date' in b ? b.date : '';
            
            // Para comparar, convertimos ambas fechas a objetos Date
            let dateA, dateB;
            
            // Si la fecha incluye barras (formato DD/MM/YYYY)
            if (typeof fechaA === 'string' && fechaA.includes('/')) {
              const partesA = fechaA.split('/');
              // Formato DD/MM/YYYY
              if (partesA.length === 3) {
                const diaA = parseInt(partesA[0]);
                const mesA = parseInt(partesA[1]) - 1; // Meses en JS: 0-11
                const anioA = parseInt(partesA[2]);
                dateA = new Date(anioA, mesA, diaA);
              } else {
                dateA = new Date(fechaA);
              }
            } else {
              dateA = fechaA ? new Date(fechaA) : new Date(0);
            }
            
            // Mismo proceso para la segunda fecha
            if (typeof fechaB === 'string' && fechaB.includes('/')) {
              const partesB = fechaB.split('/');
              // Formato DD/MM/YYYY
              if (partesB.length === 3) {
                const diaB = parseInt(partesB[0]);
                const mesB = parseInt(partesB[1]) - 1; // Meses en JS: 0-11
                const anioB = parseInt(partesB[2]);
                dateB = new Date(anioB, mesB, diaB);
              } else {
                dateB = new Date(fechaB);
              }
            } else {
              dateB = fechaB ? new Date(fechaB) : new Date(0);
            }
            
            // Comparar las fechas y ordenar descendente (más recientes primero)
            return dateB.getTime() - dateA.getTime();
          });
        })
      );
    
    this.pacientes$.subscribe(pacientes => {
      if (pacientes.length === 0) {
          this.errorMessage = "No se encontraron pacientes con el DNI especificado.";
          setTimeout(() => {
            this.errorMessage = '';
        }, 8000);
      } else {
          this.errorMessage = '';
          
          // Depurar las fechas después del formateo
          console.log('Fechas después del formateo:');
          pacientes.forEach(p => {
            console.log(`Fecha original: ${p.date}, Fecha formateada: ${this.formatearFecha(p.date)}`);
          });
      }
    });
  }


  formatearFecha(dateString: string): string {
    if (!dateString) return '';
    
    // Si la fecha viene en formato DD/MM/YYYY
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const partes = dateString.split('/');
      if (partes.length === 3) {
        let dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; 
        const anio = parseInt(partes[2]);

        const meses = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        
        return `${dia} de ${meses[mes]} de ${anio}`;
      }
    }
    
    try {
      // Crear la fecha y añadir un día para compensar
      const fecha = new Date(dateString);
      
      // Si la fecha no es válida, retornar el string original
      if (isNaN(fecha.getTime())) {
        return dateString;
      }
      
      // Añadir un día para compensar el problema
      fecha.setDate(fecha.getDate() + 1);
      
      // Arreglo con los nombres de los meses en español
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      const dia = fecha.getDate();
      const mes = meses[fecha.getMonth()];
      const anio = fecha.getFullYear();
      
      return `${dia} de ${mes} de ${anio}`;
    } catch (e) {
      console.error('Error al formatear fecha:', e);
      return dateString;
    }
  }
  

  formatearFechaAlternativo(dateString: string): string {
    if (!dateString) return '';
    
    // Si la fecha ya viene en formato de barras (DD/MM/YYYY o similar)
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const partes = dateString.split('/');
      
      if (partes.length === 3) {
        // Convertimos cada parte a número y luego formateamos
        let dia = parseInt(partes[0]).toString().padStart(2, '0');
        let mes = parseInt(partes[1]).toString().padStart(2, '0');
        const anio = partes[2];
        
        return `${dia}/${mes}/${anio}`;
      }
    }
    
    // Si el formato no es reconocible, usar el método original
    return this.formatearFecha(dateString);
  }
}