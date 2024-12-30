import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { PanelService } from '../service/panel.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {
  formPaciente!: FormGroup; 
  nuevoPaciente: any;
  errorMessage: string | null = null;
  archivoArrastrado: File | null = null;
  enviando: boolean = false;  
submitAttempted: boolean = false;  // Variable para permitir solo un intento de envío

  
  constructor(private firestore: AngularFirestore,
              private panelService: PanelService,
              private fb: FormBuilder,
              private storage: Storage,
              private datePipe: DatePipe) {
    // FORM 
    this.formPaciente = this.fb.group({
      name: new FormControl('', Validators.required),
      dni: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(9),
        Validators.pattern('[a-zA-Z0-9]*'),
      ]),
      date: new FormControl('', Validators.required),
      lab: new FormControl(''),
      file: new FormControl(null, Validators.required),
    });
  
    this.formPaciente.get('dni')?.valueChanges.subscribe(value => {
      if (value !== null) {
        const trimmedValue = value.trim();
        if (value !== trimmedValue) {
          this.formPaciente.get('dni')?.setValue(trimmedValue, { emitEvent: false });
        }
      }
    });
  }
  
  permitirArrastrar(event: DragEvent) {
    event.preventDefault();
  }
  
  soltarArchivo(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') {
      this.subirArchivo(file);
      this.archivoArrastrado = file;
    } else {
      this.errorMessage = 'Por favor, suelta solo archivos PDF.';
    }
  }
  
  obtenerArchivo(event: DragEvent): File | null {
    const file = event.dataTransfer?.files[0];
    return file || null;
  }
  
  toUppercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }

  onSubmit() {
    if (this.formPaciente.valid && !this.enviando) {
      this.enviando = true;  // Desactivar el botón de inmediato
  
      const file = this.archivoArrastrado;
      if (file) {
        this.subirArchivo(file);
      } else {
        // Si no hay archivo, mostramos un error y habilitamos el botón para reintentar
        this.errorMessage = 'Por favor, selecciona un archivo para subir.';
        this.enviando = false;  // Reactivar el botón en caso de error
      }
    }
  }
  
  subirArchivo(file: File) {
    this.errorMessage = 'Enviando...';
  
    const docsRef = ref(this.storage, `pacientesdocs/${file.name}`);
    uploadBytes(docsRef, file)
      .then(snapshot => {
        return getDownloadURL(snapshot.ref);
      })
      .then(downloadURL => {
        const nuevoPaciente = {
          fechaDeCarga: new Date().toISOString(),
          name: this.formPaciente.value.name,
          dni: this.formPaciente.value.dni,
          date: this.formPaciente.value.date, 
          file: downloadURL,
          lab: this.formPaciente.value.lab,
        };
  
        // Agregar el nuevo documento
        this.agregarNuevoDocumento(nuevoPaciente);
  
        // Enviar el documento a Firestore
        this.subirDocumento();
      })
      .catch(error => {
        console.log(error);
        this.errorMessage = 'Error al subir archivo. Por favor, inténtelo de nuevo.';
        this.enviando = false;  // Habilitar el botón solo si hay un error
      });
  }

  subirDocumento() {
    this.panelService.agregarDocumento(this.nuevoPaciente)
      .then(() => {
        console.log('Documento agregado correctamente');
        this.mostrarMensaje('Documento agregado correctamente', true);
        this.limpiarCampos();
        this.errorMessage = 'Documento agregado correctamente';
        
        // El botón sigue deshabilitado después del éxito (si quieres reactivar, cambia `enviando`)
        // this.enviando = false;  // Solo si deseas que el botón se habilite de nuevo tras éxito
      })
      .catch(error => {
        console.error('Error al agregar documento:', error);
        this.mostrarMensaje('Error al agregar documento. Por favor, inténtelo de nuevo.', false);
        this.errorMessage = 'Error al agregar documento. Por favor, inténtelo de nuevo.';
        this.enviando = false; // Solo habilitamos el botón de nuevo en caso de error
      });
  }
  
  
  
  limpiarCampos() {
    // Limpia solo los valores del formulario
    this.formPaciente.reset();
  
    // Limpia el archivo arrastrado
    this.archivoArrastrado = null;
    
    // Opcionalmente, puedes habilitar el botón para un nuevo envío en este punto si fuera necesario
    this.enviando = false; 
  }
  
  
  agregarNuevoDocumento(nuevoPaciente: any) {
    this.nuevoPaciente = nuevoPaciente;
  }


  mostrarMensaje(mensaje: string | null, exito: boolean) {
    const mensajeElemento = document.createElement('div');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.position = 'fixed';
    mensajeElemento.style.bottom = '20px';
    mensajeElemento.style.left = '50%';
    mensajeElemento.style.transform = 'translateX(-50%)';
    mensajeElemento.style.padding = '10px 20px';
    mensajeElemento.style.borderRadius = '5px';
    mensajeElemento.style.color = 'white';
    mensajeElemento.style.fontSize = '18px';
    mensajeElemento.style.zIndex = '9999';
    mensajeElemento.style.backgroundColor = exito ? 'green' : 'red';

    document.body.appendChild(mensajeElemento);
    setTimeout(() => {
      mensajeElemento.remove();
    }, 1000);    this.errorMessage = mensaje;

  }

// CERRAR MODAL
  @Output() closeModalEvent = new EventEmitter<void>();
  closeModal() {
    this.closeModalEvent.emit();
  }
}
