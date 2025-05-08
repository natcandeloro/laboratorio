import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';


// Interfaces para los datos
interface ExperienciaMap {
  'Excelente': number;
  'Buena': number;
  'Regular': number;
  'Mala': number;
  'Muy mala': number;
  [key: string]: number;
}

interface MotivosMap {
  'Por cercanía': number;
  'Por precio de los análisis': number;
  'Por la calidad del servicio': number;
  'Por recomendación': number;
  'Otro': number;
  [key: string]: number;
}

interface EdadMap {
  'Menos de 18 años': number;
  '18-30 años': number;
  '31-45 años': number;
  '46-60 años': number;
  'Más de 60 años': number;
  [key: string]: number;
}

interface RecomendacionMap {
  'Definitivamente sí': number;
  'Probablemente sí': number;
  'No estoy seguro/a': number;
  'Probablemente no': number;
  'Definitivamente no': number;
  [key: string]: number;
}

// Interfaz para los datos de encuesta
interface Encuesta {
  id?: string;
  fechaCreacion: Date;
  edad: string;
  departamento: string;
  primeraVisita: string;
  motivoEleccion: string;
  experienciaGeneral: string;
  recomendacion: string;
  [key: string]: any;
}

// Interfaz para los datos de los gráficos
interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: false,
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  encuestas: Encuesta[] = [];
  encuestasFiltradas: Encuesta[] = [];
  filterForm!: FormGroup;
  loading = true;
  error = false;
  vistaCompleta: boolean = false;
  modalComentarioVisible: boolean = false;
  tituloComentario: string = '';
  textoComentario: string = '';

  // Datos para los gráficos
  datosGeneralExperiencia: ChartData[] = [];
  datosMotivosEleccion: ChartData[] = [];
  datosEdad: ChartData[] = [];
  datosRecomendacion: ChartData[] = [];
  
  // Opciones de visualización para los gráficos
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2980b9', '#8e44ad']
  };
  
  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.inicializarFormularioFiltro();
    this.cargarEncuestas();

    // Suscribirse a cambios en el formulario de filtro
    this.filterForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }


  get cantidadRecomendacion(): number {
    return this.encuestasFiltradas.filter(e => 
      e.recomendacion === 'Definitivamente sí' || 
      e.recomendacion === 'Probablemente sí'
    ).length;
  }
  
  get porcentajeRecomendacion(): number {
    return this.encuestasFiltradas.length ? 
      (this.cantidadRecomendacion / this.encuestasFiltradas.length) * 100 : 0;
  }
  
  get cantidadExperienciaBuena(): number {
    return this.encuestasFiltradas.filter(e => 
      e.experienciaGeneral === 'Excelente' || 
      e.experienciaGeneral === 'Buena'
    ).length;
  }
  
  get porcentajeExperienciaBuena(): number {
    return this.encuestasFiltradas.length ? 
      (this.cantidadExperienciaBuena / this.encuestasFiltradas.length) * 100 : 0;
  }
  
  get cantidadPrimeraVisita(): number {
    return this.encuestasFiltradas.filter(e => 
      e.primeraVisita === 'Sí'
    ).length;
  }
  
  get porcentajePrimeraVisita(): number {
    return this.encuestasFiltradas.length ? 
      (this.cantidadPrimeraVisita / this.encuestasFiltradas.length) * 100 : 0;
  }

  toggleVistaCompleta(): void {
    this.vistaCompleta = !this.vistaCompleta;
  }
  

  inicializarFormularioFiltro(): void {
    this.filterForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      departamento: [''],
      experienciaGeneral: [''],
      motivoEleccion: ['']
    });
  }

  cargarEncuestas(): void {
    this.loading = true;
    this.firestore.collection('encuestas', ref => ref.orderBy('fechaCreacion', 'desc'))
      .get()
      .subscribe(
        (snapshot) => {
          this.encuestas = snapshot.docs.map(doc => {
            const data = doc.data() as any;
            // Convertir Timestamp de Firestore a Date de JavaScript
            if (data.fechaCreacion) {
              data.fechaCreacion = data.fechaCreacion.toDate();
            }
            return { id: doc.id, ...data } as Encuesta;
          });
          this.encuestasFiltradas = [...this.encuestas];
          this.prepararDatosGraficos();
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar encuestas:', error);
          this.error = true;
          this.loading = false;
        }
      );
  }

  aplicarFiltros(): void {
    const filtros = this.filterForm.value;
    
    this.encuestasFiltradas = this.encuestas.filter((encuesta) => {
      // Filtro por fecha inicio
      if (filtros.fechaInicio && encuesta.fechaCreacion < new Date(filtros.fechaInicio)) {
        return false;
      }
      
      // Filtro por fecha fin
      if (filtros.fechaFin) {
        const fechaFin = new Date(filtros.fechaFin);
        fechaFin.setHours(23, 59, 59);
        if (encuesta.fechaCreacion > fechaFin) {
          return false;
        }
      }
      
      // Filtro por departamento
      if (filtros.departamento && encuesta.departamento !== filtros.departamento) {
        return false;
      }
      
      // Filtro por experiencia general
      if (filtros.experienciaGeneral && encuesta.experienciaGeneral !== filtros.experienciaGeneral) {
        return false;
      }
      
      // Filtro por motivo de elección
      if (filtros.motivoEleccion && encuesta.motivoEleccion !== filtros.motivoEleccion) {
        return false;
      }
      
      return true;
    });
    
    this.prepararDatosGraficos();
  }

  prepararDatosGraficos(): void {
    // Mapeo para experiencia general
    const mapExperiencia: ExperienciaMap = {
      'Excelente': 0,
      'Buena': 0,
      'Regular': 0,
      'Mala': 0,
      'Muy mala': 0
    };
    
    // Mapeo para motivo de elección
    const mapMotivos: MotivosMap = {
      'Por cercanía': 0,
      'Por precio de los análisis': 0,
      'Por la calidad del servicio': 0,
      'Por recomendación': 0,
      'Otro': 0
    };
    
    // Mapeo para edad
    const mapEdad: EdadMap = {
      'Menos de 18 años': 0,
      '18-30 años': 0,
      '31-45 años': 0,
      '46-60 años': 0,
      'Más de 60 años': 0
    };
    
    // Mapeo para recomendación
    const mapRecomendacion: RecomendacionMap = {
      'Definitivamente sí': 0,
      'Probablemente sí': 0,
      'No estoy seguro/a': 0,
      'Probablemente no': 0,
      'Definitivamente no': 0
    };
    
    // Contar ocurrencias para cada categoría
    this.encuestasFiltradas.forEach(encuesta => {
      // Experiencia general
      if (encuesta.experienciaGeneral && mapExperiencia.hasOwnProperty(encuesta.experienciaGeneral)) {
        mapExperiencia[encuesta.experienciaGeneral]++;
      }
      
      // Motivo de elección
      if (encuesta.motivoEleccion && mapMotivos.hasOwnProperty(encuesta.motivoEleccion)) {
        mapMotivos[encuesta.motivoEleccion]++;
      }
      
      // Edad
      if (encuesta.edad && mapEdad.hasOwnProperty(encuesta.edad)) {
        mapEdad[encuesta.edad]++;
      }
      
      // Recomendación
      if (encuesta.recomendacion && mapRecomendacion.hasOwnProperty(encuesta.recomendacion)) {
        mapRecomendacion[encuesta.recomendacion]++;
      }
    });
    
    // Convertir a formato para gráficos
    this.datosGeneralExperiencia = this.convertirParaGrafico(mapExperiencia);
    this.datosMotivosEleccion = this.convertirParaGrafico(mapMotivos);
    this.datosEdad = this.convertirParaGrafico(mapEdad);
    this.datosRecomendacion = this.convertirParaGrafico(mapRecomendacion);
  }

  convertirParaGrafico(datos: any): ChartData[] {
    return Object.keys(datos).map(key => ({
      name: key,
      value: datos[key]
    }));
  }

  obtenerDepartamentos(): string[] {
    const departamentos = new Set<string>();
    this.encuestasFiltradas.forEach(encuesta => {
      if (encuesta.departamento) {
        departamentos.add(encuesta.departamento);
      }
    });
    return Array.from(departamentos);
  }

  formatearMediosDePago(mediosPago: any): string {
    if (!mediosPago || typeof mediosPago !== 'object') {
      return '-';
    }
    
    // Verificar si hay algún medio de pago seleccionado (con valor true)
    if (mediosPago.efectivo) {
      return 'Efectivo';
    } else if (mediosPago.debito) {
      return 'Débito';
    } else if (mediosPago.credito) {
      return 'Crédito';
    } else if (mediosPago.transferencia) {
      return 'Transferencia';
    } else if (mediosPago.otro) {
      return 'Otro';
    } else {
      return '-';
    }
  }

  obtenerExperiencias(): string[] {
    return ['Excelente', 'Buena', 'Regular', 'Mala', 'Muy mala'];
  }

  obtenerMotivosEleccion(): string[] {
    return ['Por cercanía', 'Por precio de los análisis', 'Por la calidad del servicio', 'Por recomendación', 'Otro'];
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.encuestasFiltradas = [...this.encuestas];
    this.prepararDatosGraficos();
  }

  mostrarComentario(titulo: string, texto: string): void {
    this.tituloComentario = titulo;
    this.textoComentario = texto || 'No hay comentarios disponibles.';
    this.modalComentarioVisible = true;
    
    // Evitar que se pueda hacer scroll en el fondo mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  }
  
  cerrarModal(): void {
    this.modalComentarioVisible = false;
    
    // Restaurar el scroll
    document.body.style.overflow = 'auto';
  }

  exportarExcel(): void {
    if (this.encuestasFiltradas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
  
    const todasLasClaves = new Set<string>();
    this.encuestasFiltradas.forEach(encuesta => {
      Object.keys(encuesta).forEach(key => {
        if (key !== 'id') { // No incluir el ID en el Excel
          todasLasClaves.add(key);
        }
      });
    });
    const claves = Array.from(todasLasClaves);
  
    // Preparar los datos para el Excel (array de objetos)
    const datos = this.encuestasFiltradas.map(encuesta => {
      const fila: any = {};
      
      claves.forEach(clave => {
        let valor = encuesta[clave];
        
        // Manejar los casos especiales
        if (clave === 'fechaCreacion' && valor instanceof Date) {
          valor = valor.toLocaleDateString(); // Formato más amigable para Excel
        } else if (clave === 'mediosPago' && typeof valor === 'object') {
          valor = Object.keys(valor).filter(k => valor[k]).join('; ');
        }
        
        fila[clave] = valor === undefined || valor === null ? '' : valor;
      });
      
      return fila;
    });
  
    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(datos);
    
    // Crear un libro de trabajo y agregar la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados Encuestas');
    
    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, `resultados_encuesta_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  volverAlPanel(): void {
    this.router.navigate(['/admin/panel']); 
  }
}
