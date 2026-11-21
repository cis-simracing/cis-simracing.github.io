import { Component, NgZone, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { Observable, firstValueFrom, map } from 'rxjs';
import { firebaseAuth } from '../../firebase';
import { ImageUploadService } from '../../services/image-upload.service';
import { RaceService } from '../../services/race.service';
import { Race, RaceStatus } from '../../models/race.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private ngZone = inject(NgZone);
  private imageUploadService = inject(ImageUploadService);
  private raceService = inject(RaceService);

  // Stream reattivo dello stato autenticazione Firebase
  user$: Observable<User | null> = new Observable<User | null>((subscriber) => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (u) => this.ngZone.run(() => subscriber.next(u)),
      (err) => this.ngZone.run(() => subscriber.error(err)),
    );
    return () => unsubscribe();
  });
  races$!: Observable<Race[]>;

  // Credenziali Login
  email = '';
  password = '';
  loginError = '';

  // Stato modifica evento esistente
  editingRaceId: string | null = null;

  // Form Gara / Risultati
  newRace: Race = this.createEmptyRace();

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    // Elenco live di tutte le gare per modifica ed eliminazione
    this.races$ = this.raceService
      .getAllRaces()
      .pipe(
        map((races) =>
          [...races].sort((a, b) => b.startDate.localeCompare(a.startDate)),
        ),
      );
  }

  // Autenticazione
  async onLogin(): Promise<void> {
    this.loginError = '';
    const cleanEmail = this.email.trim();
    try {
      // Imposta la sessione valida solo fino alla chiusura della scheda/finestra
      await setPersistence(firebaseAuth, browserSessionPersistence);

      await signInWithEmailAndPassword(firebaseAuth, cleanEmail, this.password);
    } catch (err: any) {
      console.error('Dettaglio errore login Firebase:', err);
      const code = err?.code || 'errore-sconosciuto';
      switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          this.loginError = `Email o password errati (${code}).`;
          break;
        case 'auth/too-many-requests':
          this.loginError = `Troppi tentativi falliti: account temporaneamente bloccato. Attendi qualche minuto (${code}).`;
          break;
        case 'auth/operation-not-allowed':
          this.loginError = `Accesso Email/Password non abilitato su Firebase (${code}).`;
          break;
        default:
          this.loginError = `Errore accesso [${code}]: ${err?.message || 'Errore sconosciuto'}`;
      }
    }
  }

  async onLogout(): Promise<void> {
    await signOut(firebaseAuth);
  }

  // Gestione File Immagine
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedFile = target.files[0];

      // Genera preview locale
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Carica una gara esistente nel form per modificarla
  editRace(race: Race): void {
    if (!race.id) return;
    this.editingRaceId = race.id;
    this.newRace = {
      title: race.title || '',
      game: race.game || 'EA WRC',
      status: race.status || 'upcoming',
      startDate: race.startDate || '',
      endDate: race.endDate || '',
      trackName: race.trackName || '',
      registrationUrl: race.registrationUrl || '',
      description: race.description || '',
      resultsImageUrl: race.resultsImageUrl || '',
    };
    this.selectedFile = null;
    this.imagePreview = race.resultsImageUrl || null;
    this.successMessage = '';
    this.errorMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Elimina gara da Firestore
  async deleteRace(race: Race): Promise<void> {
    if (!race.id) return;
    const confirmed = window.confirm(
      `Vuoi davvero eliminare "${race.title}"? L'operazione non è reversibile.`,
    );
    if (!confirmed) return;

    this.errorMessage = '';
    this.successMessage = '';
    try {
      await this.raceService.deleteRace(race.id);
      if (this.editingRaceId === race.id) {
        this.resetForm();
      }
      this.successMessage = `Evento "${race.title}" eliminato con successo.`;
    } catch (error: any) {
      console.error('Errore eliminazione gara:', error);
      this.errorMessage = `Errore durante l'eliminazione: ${error?.message || 'riprova.'}`;
    }
  }

  // Salvataggio (creazione o aggiornamento) Gara
  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isUploading = true;

    try {
      // 1. Se c'è un file selezionato, caricalo su ImgBB
      if (this.selectedFile) {
        if (
          !environment.imgbbApiKey ||
          environment.imgbbApiKey === 'LA_TUA_IMGBB_API_KEY'
        ) {
          throw new Error(
            'Chiave ImgBB non ancora configurata negli environment. Inserisci la chiave ImgBB oppure incolla direttamente un URL immagine.',
          );
        }
        const uploadedUrl = await firstValueFrom(
          this.imageUploadService.uploadImage(this.selectedFile),
        );
        this.newRace.resultsImageUrl = uploadedUrl;
      }

      // 2. Crea o aggiorna su Firestore
      const payload: Race = { ...this.newRace };
      if (this.editingRaceId) {
        await this.raceService.updateRace(this.editingRaceId, payload);
        this.successMessage = 'Evento aggiornato con successo!';
      } else {
        await this.raceService.addRace(payload);
        this.successMessage = 'Evento / Risultato pubblicato con successo!';
      }

      this.resetForm();
    } catch (error: any) {
      console.error('Errore salvataggio gara:', error);
      this.errorMessage =
        error?.message || 'Errore durante la pubblicazione. Riprova.';
    } finally {
      this.isUploading = false;
    }
  }

  getStatusLabel(status: RaceStatus): string {
    switch (status) {
      case 'ongoing':
        return 'IN CORSO';
      case 'upcoming':
        return 'IN ARRIVO';
      case 'completed':
        return 'CONCLUSA';
    }
  }

  private createEmptyRace(): Race {
    return {
      title: '',
      game: 'EA WRC',
      status: 'upcoming',
      startDate: '',
      endDate: '',
      trackName: '',
      registrationUrl: '',
      description: '',
      resultsImageUrl: '',
    };
  }

  private resetForm(): void {
    this.editingRaceId = null;
    this.newRace = this.createEmptyRace();
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
