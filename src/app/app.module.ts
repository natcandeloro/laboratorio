import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientModule } from './module/patient/patient.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './module/patient/layout.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [AngularFireAuth],
    bootstrap: [AppComponent],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        provideFirebaseApp(() => initializeApp( environment.firebase)),
    provideFirestore(() => getFirestore()),
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        PatientModule,
        LayoutModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
      provideFirebaseApp(() => initializeApp({"projectId":"paracelsus-laboratorio","appId":"1:1056131389080:web:288c1cb5e3e6b05a14e2ed","storageBucket":"paracelsus-laboratorio.appspot.com","apiKey":"AIzaSyAp6eBnJdnE7rplaJ_AZzXY5dxGqzfjjjc","authDomain":"paracelsus-laboratorio.firebaseapp.com","messagingSenderId":"1056131389080"})),
        provideStorage(() => getStorage()),
    ]
    
})
export class AppModule { }
