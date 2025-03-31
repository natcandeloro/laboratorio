import { Component,  OnInit } from '@angular/core';

@Component({
  selector: 'app-obras-sociales',
  templateUrl: './obras-sociales.component.html',
  styleUrl: './obras-sociales.component.css'
})
export class ObrasSocialesComponent implements OnInit  {
  searchTerm: string = '';
  obrasSociales: any[] = [];
  filteredObrasSociales: any[] = [];
  showResults: boolean = false;
  showPlanes: boolean = false;
  selectedObraSocial: any = null;

  constructor() { }

  ngOnInit(): void {
    // Inicializamos la lista de obras sociales desde el documento
    this.obrasSociales = this.getObrasSociales();
    this.filteredObrasSociales = [...this.obrasSociales];
  }

  search(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredObrasSociales = [...this.obrasSociales];
      this.showResults = false;
      return;
    }

    this.showResults = true;
    const term = this.searchTerm.toLowerCase();
    
    this.filteredObrasSociales = this.obrasSociales.filter(obra => {
      // Buscar en el nombre de la obra social
      if (obra.nombre.toLowerCase().includes(term)) {
        return true;
      }
      
      // Buscar en los planes
      if (obra.planes && obra.planes.some((plan: string) => plan.toLowerCase().includes(term))) {
        return true;
      }
      
      return false;
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredObrasSociales = [...this.obrasSociales];
    this.showResults = false;
    this.showPlanes = false;
    this.selectedObraSocial = null;
  }

  togglePlanes(obra: any): void {
    if (this.selectedObraSocial === obra) {
      this.showPlanes = !this.showPlanes;
    } else {
      this.selectedObraSocial = obra;
      this.showPlanes = true;
    }
  }
  
  hasPlanesOrEntidades(obra: any): boolean {
    return (obra.planes && obra.planes.length > 0) || (obra.entidades && obra.entidades.length > 0);
  }

  // Base de datos estática extraída del documento
  private getObrasSociales(): any[] {
    return [
      { 
        nombre: "UNION PERSONAL", 
        planes: ["CLASSIC", "DORADO", "VERDE", "PLATINO", "110", "210", "310", "220", "320", "420PMO", "AZUL", "MONOTRIBUTO", "FAMILIAR", "AC 101", "AC 102", "Up 10"]
      },
      { 
        nombre: "SCIS", 
        planes: ["SC 50", "SC 100", "SC 150", "SC 250", "SC 300", "SC 500", "SC 550", "SC 600", "SC 4000"],
        entidades: ["AATRAC-OSTRAC (T. de comunicación)", "OSDEPYM (Obra Social de Empresarios, Profesionales y Monotributistas)", "OSFFENTOS (T. obras sanitarias)", "OSPACA-CER (actividad cervecera)", "OSPESCA (P. de pesca)", "OSPOCE (T. control externo)", "OSSIMRA (Metalmecánica)", "OSPEDYC (Entidades deportivas y Civiles)", "OSPCRA (PERSONAL DE CEMENTERIOS)", "OSPOCE (TRABAJADORES CONTROL)", "OBRAS SANITARIAS (OSFENTOS)", "TRABAJADORES DE LAS COMUNICACIONES (OSPOCE)"]
      },
      { 
        nombre: "AGENTES DE PROPAGANDA MEDICA (AAPM/OSAPM)", 
        planes: ["5000 APM", "5000", "3000", "1000", "PLATINO"]
      },
      { 
        nombre: "AMADIOS", 
        planes: []
      },
      { 
        nombre: "SACRA (AMAS DE CASA)", 
        planes: ["CLASICO DORADA", "SOCIAL VERDE", "TOTAL GRIS", "PROFESIONAL AZUL"]
      },
      { 
        nombre: "SADAIC (SOCIEDAD ARGENTINA DE AUTORES Y COMPOSITORES)", 
        planes: []
      },
      { 
        nombre: "AVALIAN (ACA SALUD)", 
        planes: ["SELECTA (AS 500 Y AS 400)", "UNIVERSAL+ (23/75, 23/40, 21/50, 21/40, 20/40)", "SUPERIOR (AS 300)", "UNIVERSAL (7/50 Y 70/40)", "INTEGRAL (AS 200, AS 204, 1, 1/40, 4/40, 11, 11/40, 18)", "PLAN CLASICO (2)", "PLAN CLASICO (3 Y 9)", "PLAN PMO"]
      },
      { 
        nombre: "BRAMED", 
        planes: []
      },
      { 
        nombre: "CAJA FORENSE (CAJA FORENS ABOGADOS Y PROCURADORES)", 
        planes: []
      },
      { 
        nombre: "BOREAL (COBERTURA DE SALUD)", 
        planes: ["MAGNUM", "A3", "OSEDEIV A3", "INTEGRAL", "CLASICO", "PLAN PMO", "MAGNUM PMI", "MAGNUM DISCAPACIDAD", "MAGNUM ONCOLOGICO"]
      },
      { 
        nombre: "COFAM (COLEGIO FARMACEUTICO DE MENDOZA)", 
        planes: []
      },
      { 
        nombre: "DAMSU (DEPARTAMENTO DE ASISTENCIA MEDICO SOCIAL UNIVERSITARIO)", 
        planes: []
      },
      { 
        nombre: "DIARIOS Y REVISTAS", 
        planes: []
      },
      { 
        nombre: "OSDOP (DOCENTES PRIVADOS)", 
        planes: []
      },
      { 
        nombre: "OSADEF (OBRA SOCIAL DE LAS ASOCIACIONES DE EMPLEADOS DE FARMACIA)", 
        planes: []
      },
      { 
        nombre: "FEDERADA SALUD", 
        planes: []
      },
      { 
        nombre: "SER SALUD", 
        entidades: ["OSPIF (OBRA SOCIAL DEL PERSONAL DE LA INDUSTRIA DEL FIBROCEMENTO)", "INDUSTRIA DEL HIELO", "INDUSTRIA MINERA (OSAM)", "PERSONAL DEL CEMENTO (OSPCRA)", "PERSONAL DE TELECOMUNICACIONES (OSTEL)", "PERSONAL DE CEMENTRERIOS (OSPCRA)"] 
      },
      { 
        nombre: "AMFFA – FLORENTINO AMEGHINO", 
        planes: []
      },
      { 
        nombre: "IOSFA (ISNTITUTO DE OBRA SOCIAL DE LAS FUERZAS ARMADAS)", 
        planes: []
      },
      { 
        nombre: "GALENO", 
        planes: ["ORO", "PLATA", "AZUL"]
      },
      { 
        nombre: "PAMI (JUBILADOS Y PENSIONADOS)", 
        planes: []
      },
      { 
        nombre: "LUIS PASTEUR", 
        planes: []
      },
      { 
        nombre: "OSFATLYF (OBRA SOCIAL DE LA FEDERACION ARGENTINA DE TRABAJADORES DE LUZ Y FUERZA)", 
        planes: []
      },
      { 
        nombre: "MEDICUS", 
        planes: []
      },
      { 
        nombre: "MEDIFE", 
        planes: ["BRONCE", "PLATA", "ORO", "PLATINUM"]
      },
      { 
        nombre: "MEDYCIN", 
        planes: ["DELTA", "CLASIC", "VIP"]
      },
      { 
        nombre: "MUTUAL CONFERENCIA EPISCOPAL (EX SAN PEDRO)", 
        planes: []
      },
      { 
        nombre: "NOBIS", 
        planes: ["B200", "B300", "N200", "N400", "N500"]
      },
      { 
        nombre: "OSDIPP (OBRA SOCIAL DEL PERSONAL DE DIRECCION DE LA INDUSTRIA PRIVADA DEL PRETROLEO)", 
        planes: []
      },
      { 
        nombre: "OSEP (OBRA SOCIAL DE EMPLEADO PUBLICOS)", 
        planes: []
      },
      { 
        nombre: "OSPIL (OBRA SOCIAL DE LECHEROS)", 
        planes: []
      },
      { 
        nombre: "OSPES (OBRA SOCIAL DE PERSONAL DE ESTACIONES DE SERVIVIOS Y AFINES)", 
        planes: []
      },
      { 
        nombre: "OSPE (OBRA SOCIAL DE PETROLEROS)", 
        planes: ["A 601", "A 425", "A 301", "D 371", "A 402", "A 402 CUYO", "404 EMPRENDIMIENTOS", "A 406", "A 600", "A 604", "A 700", "A 704", "YPF A", "YPF B", "OPESSA", "M 400", "D450", "D 452", "D456", "D 500", "D 650", "D 750", "D 752", "D 756", "NASA", "PMO", "PMO_MT", "PMO_SD", "HOSP. ESPAÑOL FAMILIA JOVEN"]
      },
      { 
        nombre: "WILLIAM HOPE (OBRA SOCIAL DEL PERSONAL DE PERFUMERIA)", 
        planes: []
      },
      { 
        nombre: "20 DE OCTUBRE (OBRAS SANITARAS)", 
        planes: []
      },
      { 
        nombre: "OMINT (CENTRALAB)", 
        planes: []
      },
      { 
        nombre: "OSDE (ORGANIZACIУN DE SERVICIOS DIRECTOS EMPRESARIOS)", 
        planes: ["6 030", "1-015", "2-025", "2-210", "2-310", "2-410", "2-450", "2-510"]
      },
      { 
        nombre: "OSJERA (PERSONAL JERARQUICO)", 
        planes: ["BASICO – PLAN 600", "BASICO PLUS – PLAN 700", "PLAN 800", "PLAN JOVEN 800", "D'OR 800"]
      },
      { 
        nombre: "OSPF (OBRA SOCIAL DEL PERSONAL DE FARMACIA)", 
        planes: []
      },
      { 
        nombre: "PASTELEROS (ELEVAR)", 
        planes: []
      },
      { 
        nombre: "OPDEA (PERSONAL DIRECTIVO DE EMPRESAS ALIMENTICIAS)", 
        planes: ["01 (BLANCO)", "03 Y 05 (AMARILLO)", "04 Y XXI (AZUL)", "10 (PLATEADA)", "12 Y 15 (DORADA)", "JOVEN (PO/J6)", "POST EGRESO"]
      },
      { 
        nombre: "JERARQUICOS SALUD (PERSONAL JERARQUICO BANCARIO)", 
        planes: []
      },
      { 
        nombre: "OSPJN (OBRA SOCIAL DEL PODER JUDICIAL DE LA NACION)", 
        planes: []
      },
      { 
        nombre: "PREVENCION SALUD", 
        planes: ["BASICO", "A", "A1 A2", "ON DEMAND", "A3", "A4", "A5", "A6 JOVEN"]
      },
      { 
        nombre: "OSEIV (OBRA SOCIAL DE LA INDUSTRIA DEL VIDRIO) – RED DE SEGURO MEDICO", 
        planes: ["PMO", "OS O SOLIDARIO", "VIP", "VIP ORO", "PREMIUM", "PLATINUM"]
      },
      { 
        nombre: "ROI S.A", 
        planes: ["OSMISS- PLAN 100", "OSMISS –PLAN 200", "OSPL (OBRA SOCIAL DEL PERSONAL LADRILLERO)", "DOCTORED – PLAN 500", "DOCTORED – PLANES 1000 – 2000 – 3000"]
      },
      { 
        nombre: "SANCOR SALUD", 
        planes: ["C", "A1 LINEA EXCLUSIVE S5000 Y S6000", "A2 4500, 4065, 4000, 3500, 3000", "A3: 2000", "A3 1500, 1000 Y 500", "S700 A Y S 800 V (EX STAFF AMARILLO Y VERDE) – F 700 Y F 800"]
      },
      { 
        nombre: "OSSEG (OBRA SOCIAL DE SEGUROS)", 
        planes: ["INTEGRAL", "INTEGRAL ADHERENTE", "ESPECIAL", "MATERNO INFANTIL"]
      },
      { 
        nombre: "OSMATA (OBRA SOCIAL DE MECANICOS Y AFINES)", 
        planes: ["PMO", "PMI"]
      },
      { 
        nombre: "SWISS MEDICAL", 
        planes: []
      },
      { 
        nombre: "APSOT (ASOCIACION DEL PERSONAL DE LA ORGANIZACIУN TECHINT)", 
        planes: []
      },
      { 
        nombre: "TV SALUD", 
        planes: []
      },
      { 
        nombre: "UNIMED", 
        planes: ["HS 45", "SPS 55", "HS 85", "SPS 75", "HS 95", "SPS 95"]
      },
      { 
        nombre: "DASUTEN (UNIVERSIDAD TECNOLOGICA)", 
        planes: []
      },
      { 
        nombre: "OSCTPC (UTA OBRA SOCIAL DE TRASNPORTE DE COLECTIVO DE PASAJEROS)", 
        planes: []
      }
    ];
  }
}
