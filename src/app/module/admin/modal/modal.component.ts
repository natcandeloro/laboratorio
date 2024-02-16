import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { PanelService } from '../service/panel.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

interface Paciente {
  id: number;
  nombre: string;
  dni: string;
  file: string;
  date: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],

})
export class ModalComponent {

  formPaciente!: FormGroup; 
nuevoPaciente: any;

  constructor(private firestore: AngularFirestore,
              private panelService: PanelService,
              private fb: FormBuilder,
              private storage: Storage,) {
// FORM 
  this.formPaciente = this.fb.group({
    name: new FormControl('', Validators.required),
    dni: new FormControl ('', Validators.required),
    date: new FormControl('', Validators.required),
    file: new FormControl(null, Validators.required),
  });
}

 enviarArchivo($event: any) {
    const file = $event.target.files[0];
    console.log(file); 
  
    const docsRef = ref(this.storage, `pacientesdocs/${file.name}`);
    uploadBytes(docsRef, file)
      .then(snapshot => {
        return getDownloadURL(snapshot.ref);
      })
      .then(downloadURL => {
        const nuevoPaciente = {
          name: this.formPaciente.value.name,
          dni: this.formPaciente.value.dni,
          date: this.formPaciente.value.date, 
          file: downloadURL,
        };
        
        this.agregarNuevoDocumento(nuevoPaciente);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  agregarNuevoDocumento(nuevoPaciente: any) {
    this.panelService.agregarDocumento(nuevoPaciente)
      .then(() => {
        console.log('Documento agregado correctamente');
        this.mostrarMensaje('Documento agregado correctamente', true);
        setTimeout(() => {
          window.close();
          window.location.reload();
        }); 
      })
      .catch(error => {
        console.error('Error al agregar documento:', error);
        this.mostrarMensaje('Error al agregar documento. Por favor, inténtelo de nuevo.', false);
      });
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

  // OBTENER INFO 
  obtenerPacientes(){
  }
// CERRAR MODAL
  @Output() closeModalEvent = new EventEmitter<void>();
  closeModal() {
    this.closeModalEvent.emit();
  }
}
