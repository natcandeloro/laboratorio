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
  archivoArrastrado!: File ;

  constructor(private firestore: AngularFirestore,
              private panelService: PanelService,
              private fb: FormBuilder,
              private storage: Storage,
              private datePipe: DatePipe) {
// FORM 
  this.formPaciente = this.fb.group({
    name: new FormControl('', Validators.required),
    dni: new FormControl ('', Validators.required),
    date: new FormControl('', Validators.required),
    lab: new FormControl(''),
    file: new FormControl(null, Validators.required),
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
  
  enviarArchivo(event: any) {
    const file = event.target.files[0];
    this.subirArchivo(file);
    this.archivoArrastrado = file;
  }
  
  subirArchivo(file: File) {
    console.log(file); 
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

        this.agregarNuevoDocumento(nuevoPaciente);
      })
      .catch(error => {
        console.log(error);
      });
  }

  subirDocumento() {
    this.panelService.agregarDocumento(this.nuevoPaciente)
      .then(() => {
        console.log('Documento agregado correctamente');
        this.mostrarMensaje('Documento agregado correctamente', true);
        this.limpiarCampos(); 
      })
      .catch(error => {
        console.error('Error al agregar documento:', error);
        this.mostrarMensaje('Error al agregar documento. Por favor, inténtelo de nuevo.', false);
      });
  }
  
  limpiarCampos() {
      this.formPaciente.reset(); // Esto limpiará todos los campos del FormGroup
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
    }, 1000);
  }

// CERRAR MODAL
  @Output() closeModalEvent = new EventEmitter<void>();
  closeModal() {
    this.closeModalEvent.emit();
  }
}
