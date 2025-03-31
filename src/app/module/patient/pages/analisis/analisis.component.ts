import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModaAnalisisComponent } from '../moda-analisis/moda-analisis.component';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrl: './analisis.component.css'
})
export class AnalisisComponent {
  constructor(private dialog: MatDialog) {}

  expandedCategory: string | null = null;

  analysisCategories = [
    {
      title: "Hematología",
      description: "Análisis de células sanguíneas",
      details: [
        {
          name: "Hemograma Completo",
          description: `
            <p>El hemograma es un análisis de sangre que evalúa la cantidad y calidad de las células sanguíneas:</p>
            <ul>
              <li><strong>Glóbulos rojos (eritrocitos):</strong> Transportan oxígeno en la sangre.</li>
              <li><strong>Glóbulos blancos (leucocitos):</strong> Defienden el cuerpo contra infecciones.</li>
              <li><strong>Plaquetas:</strong> Ayudan en la coagulación de la sangre.</li>
              <li><strong>Hemoglobina y hematocrito:</strong> Indicadores clave de anemia u otras condiciones.</li>
            </ul>
            <p>Es un análisis fundamental para detectar infecciones, anemias y trastornos sanguíneos.</p>`
        },
        {
          name: "Coagulograma",
          description: `
            <p>El coagulograma es un conjunto de pruebas que evalúa la capacidad de coagulación de la sangre.</p>
            <p>Este estudio incluye:</p>
            <ul>
              <li>Tiempo de protrombina (TP)</li>
              <li>Tiempo de tromboplastina parcial activada (APTT)</li>
              <li>Fibrinógeno</li>
            </ul>`
        }
      ]
    },
    {
      title: "Bioquímica",
      description: "Análisis metabólicos y función orgánica",
      details: [
        {
          name: "Glucemia",
          description: `
            <p>La glucemia mide la concentración de glucosa en la sangre y es fundamental para evaluar el metabolismo de los carbohidratos.</p>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Diagnóstico y monitoreo de diabetes mellitus.</li>
              <li>Evaluación de hipoglucemia (niveles bajos de azúcar en sangre).</li>
              <li>Control en personas con resistencia a la insulina o riesgo de diabetes.</li>
            </ul>`
        },
        {
          name: "Uremia",
          description: `
            <p>La uremia mide la cantidad de urea en la sangre, un producto de desecho generado por el hígado tras la descomposición de las proteínas y eliminado por los riñones.</p>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Evaluar la función renal y detectar posibles enfermedades renales.</li>
              <li>Monitorear la hidratación y el metabolismo de proteínas.</li>
              <li>Diagnosticar problemas hepáticos o de insuficiencia renal.</li>
            </ul>
            <p><em>Nota: Se suele complementar con la creatinina para una mejor evaluación de la función renal.</em></p>`
        },
        {
          name: "Perfil Lipídico",
          description: `
            <p>El perfil lipídico es un análisis que mide los niveles de grasas en la sangre, ayudando a evaluar el riesgo de enfermedades cardiovasculares.</p>
            <p><strong>Parámetros principales:</strong></p>
            <ul>
              <li>Colesterol total: Indica la cantidad total de colesterol en sangre.</li>
              <li>Colesterol LDL ("malo"): Se acumula en las arterias y aumenta el riesgo de enfermedades cardíacas.</li>
              <li>Colesterol HDL ("bueno"): Ayuda a eliminar el colesterol de las arterias, reduciendo el riesgo cardiovascular.</li>
              <li>Triglicéridos: Son otro tipo de grasa en la sangre.</li>
            </ul>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Evaluar el riesgo de enfermedades del corazón y aterosclerosis.</li>
              <li>Diagnosticar y monitorear dislipidemias (colesterol alto).</li>
              <li>Control en personas con diabetes, hipertensión o antecedentes familiares de enfermedades cardíacas.</li>
            </ul>`
        },
        {
          name: "Hepatograma",
          description: `
            <p>El hepatograma es un conjunto de análisis que evalúan la función del hígado mediante la medición de diferentes enzimas y proteínas en la sangre.</p>
            <p><strong>Principales parámetros:</strong></p>
            <ul>
              <li>Transaminasas (ALT/GPT y AST/GOT): Detectan daño hepático.</li>
              <li>Fosfatasa alcalina (FA): Indicador de problemas hepáticos o biliares.</li>
              <li>Gamma-glutamil transferasa (GGT): Relacionada con enfermedades hepáticas.</li>
              <li>Bilirrubina: Evalúa la función hepática y la presencia de ictericia.</li>
            </ul>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Diagnóstico de hepatitis, cirrosis y otras enfermedades hepáticas.</li>
              <li>Monitoreo de la función hepática.</li>
              <li>Evaluación antes de tratamientos médicos o cirugías.</li>
            </ul>`
        }
      ]
    },
    {
      title: "Inmunología y Serología",
      description: "Evaluación del sistema inmunológico",
      details: [
        {
          name: "Pruebas de Anticuerpos",
          description: `
            <p>Estas pruebas evalúan la respuesta inmune del cuerpo y pueden detectar:</p>
            <ul>
              <li>Infecciones actuales o pasadas</li>
              <li>Enfermedades autoinmunes</li>
              <li>Estado inmunológico general</li>
            </ul>`
        },
        {
          name: "Pruebas de Alergia",
          description: `
            <p>Evalúan la respuesta inmunológica a diferentes alérgenos y ayudan a:</p>
            <ul>
              <li>Identificar alergias específicas</li>
              <li>Determinar la severidad de las reacciones alérgicas</li>
              <li>Guiar el tratamiento de alergias</li>
            </ul>`
        }
      ]
    },
    {
      title: "Microbiología",
      description: "Detección de microorganismos",
      details: [
        {
          name: "Cultivo de Orina",
          description: `
            <p>Análisis que detecta y cuantifica bacterias en la orina.</p>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Diagnosticar infecciones urinarias</li>
              <li>Identificar el tipo de bacteria causante</li>
              <li>Determinar el antibiótico más efectivo</li>
            </ul>`
        },
        {
          name: "Prueba de Estreptococo",
          description: `
            <p>Detecta la presencia de bacterias estreptocócicas.</p>
            <p><strong>Aplicaciones:</strong></p>
            <ul>
              <li>Diagnóstico de faringitis estreptocócica</li>
              <li>Prevención de complicaciones post-estreptocócicas</li>
            </ul>`
        }
      ]
    },
    {
      title: "Hormonas y Endocrinología",
      description: "Evaluación del sistema hormonal",
      details: [
        {
          name: "TSH (Hormona Estimulante de la Tiroides)",
          description: `
            <p>La TSH es una hormona producida por la hipófisis que regula la función de la glándula tiroides.</p>
            <p><strong>¿Para qué sirve?</strong></p>
            <ul>
              <li>Diagnóstico y monitoreo del hipotiroidismo e hipertiroidismo.</li>
              <li>Evaluación de la función tiroidea en personas con fatiga, cambios de peso o problemas metabólicos.</li>
              <li>Control en pacientes con tratamiento para trastornos tiroideos.</li>
            </ul>
            <p><em>Nota: En algunos casos, se complementa con T3 y T4 para una evaluación más completa.</em></p>`
        },
        {
          name: "Testosterona",
          description: `
            <p>Hormona sexual importante tanto en hombres como en mujeres.</p>
            <p><strong>Usos:</strong></p>
            <ul>
              <li>Evaluación de la función reproductiva</li>
              <li>Diagnóstico de trastornos hormonales</li>
              <li>Control de tratamientos hormonales</li>
            </ul>`
        }
      ]
    },
    {
      title: "Marcadores Tumorales",
      description: "Detección y seguimiento oncológico",
      details: [
        {
          name: "PSA",
          description: `
            <p>El Antígeno Prostático Específico es una proteína producida por la próstata.</p>
            <p><strong>Aplicaciones:</strong></p>
            <ul>
              <li>Screening de cáncer de próstata</li>
              <li>Seguimiento de tratamientos oncológicos</li>
              <li>Monitoreo post-tratamiento</li>
            </ul>`
        },
        {
          name: "CA-125",
          description: `
            <p>Marcador tumoral principalmente asociado con cáncer de ovario.</p>
            <p><strong>Usos:</strong></p>
            <ul>
              <li>Monitoreo de cáncer de ovario</li>
              <li>Evaluación de la respuesta al tratamiento</li>
              <li>Detección de recurrencias</li>
            </ul>`
        }
      ]
    }
];

  openStudyDialog(study: any): void {
    this.dialog.open(ModaAnalisisComponent, {
      data: study,
      width: '600px',
      panelClass: 'study-dialog'
    });
  }

  getIconForCategory(category: string): string {
    switch (category.toUpperCase()) {
      case 'HEMATOLOGÍA':
        return 'fas fa-tint'; // Icono de gota de sangre
      case 'BIOQUÍMICA':
        return 'fas fa-flask'; // Icono de tubo de ensayo
      case 'INMUNOLOGÍA Y SEROLOGÍA':
        return 'fas fa-shield-alt'; // Icono de escudo para inmunidad
      case 'MICROBIOLOGÍA':
        return 'fas fa-bacteria'; // Icono de bacteria
      case 'HORMONAS Y ENDOCRINOLOGÍA':
        return 'fas fa-chart-line'; // Icono de gráfico para niveles hormonales
      case 'MARCADORES TUMORALES':
        return 'fas fa-search'; // Icono de búsqueda para detección
      default:
        return 'fas fa-vial'; // Icono predeterminado para análisis clínicos
    }
}
}
