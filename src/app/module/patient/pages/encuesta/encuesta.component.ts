import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  standalone: false,
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  surveyForm!: FormGroup;
  submitted = false;
  showSuccess = false;
  errorMessage = '';
  
  departamentos = [
    'Lujan de cuyo',
    'Godoy Cruz',
    'Maipu',
    'Guaymallen',
    'Otro'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.surveyForm = this.formBuilder.group({
      // 1. Información General
      edad: ['', Validators.required],
      primeraVisita: ['', Validators.required],
      departamento: ['', Validators.required],
      otroDepartamento: [''],

      // 2. Atención al Público
      amabilidad: ['', Validators.required],
      tiempoEspera: ['', Validators.required],
      resolucionDudas: ['', Validators.required],
      limpiezaComodidad: ['', Validators.required],
      comentariosAtencion: [''],

      // 3. Comunicación con los Pacientes
      informacionProcedimientos: ['', Validators.required],
      informacionTiemposEntrega: ['', Validators.required],
      escuchaRespeto: ['', Validators.required],
      comentariosComunicacion: [''],

      // 4. Aranceles y Medios de Pago
      claridadCostos: ['', Validators.required],
      razonabilidadPrecios: ['', Validators.required],
      dificultadPago: ['', Validators.required],
      mediosPago: this.formBuilder.group({
        efectivo: [false],
        debito: [false],
        credito: [false],
        transferencia: [false],
        otro: [false]
      }),
      comentariosPagos: [''],

      // 5. Resultados
      tiempoResultados: ['', Validators.required],
      claridadResultados: ['', Validators.required],
      dificultadAccesoResultados: ['', Validators.required],
      comentariosResultados: [''],

      // 6. Evaluación General
      experienciaGeneral: ['', Validators.required],
      recomendacion: ['', Validators.required],
      sugerencias: ['']
    });
  }

  // Método para verificar si se debe mostrar el campo "Otro departamento"
  mostrarOtroDepartamento(): boolean {
    return this.surveyForm.get('departamento')?.value === 'Otro';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.surveyForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      window.scrollTo(0, 0);
      return;
    }

    // Crear objeto con los datos del formulario
    const formData = this.surveyForm.value;
    
    // Agregar timestamp
    formData.fechaCreacion = new Date();

    // Enviar datos a Firestore
    this.firestore.collection('encuestas').add(formData)
      .then(() => {
        this.showSuccess = true;
        this.errorMessage = '';
        window.scrollTo(0, 0);
        
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          this.submitted = false;
          this.showSuccess = false;
          this.surveyForm.reset();
          // Opcional: redirigir a otra página
          // this.router.navigate(['/gracias']);
        }, 3000);
      })
      .catch(error => {
        this.errorMessage = 'Error al enviar la encuesta. Por favor, intente nuevamente.';
        console.error('Error al guardar la encuesta:', error);
        window.scrollTo(0, 0);
      });
  }
}
