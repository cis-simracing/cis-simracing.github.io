import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Firebase Modular Imports
import { initializeApp, getApp, getApps } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// Garantisce che l'app Firebase [DEFAULT] esista sempre prima di Auth e Firestore
function getOrInitFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(environment.firebase);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Inizializzazione Firebase con istanza condivisa e deterministica
    provideFirebaseApp(() => getOrInitFirebaseApp()),
    provideAuth(() => getAuth(getOrInitFirebaseApp())),
    provideFirestore(() => getFirestore(getOrInitFirebaseApp())),
  ],
};
