import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ImageUploadService } from '../../services/image-upload.service';
import { RaceService } from '../../services/race.service';
import { GameType, Race, RaceStatus } from '../../models/race.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private auth = inject(Auth);
  private imageUploadService = inject(ImageUploadService);
  private raceService = inject(RaceService);

  user$: Observable<User | null> = user(this.auth);

  // Credenziali Login
  email = '';
  password = '';
  loginError = '';

  // Form Gara / Risultati
  newRace: Race = {
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

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {}

  // Autenticazione
  async onLogin(): Promise<void> {
    this.loginError = '';
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
    } catch (err: any) {
      this.loginError = 'Credenziali non valide o utente non autorizzato.';
    }
  }

  async onLogout(): Promise<void> {
    await signOut(this.auth);
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

  // Salvataggio Gara
  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isUploading = true;

    try {
      // 1. Se c'è un file selezionato, caricalo su ImgBB
      if (this.selectedFile) {
        const uploadedUrl = await this.imageUploadService
          .uploadImage(this.selectedFile)
          .toPromise();
        this.newRace.resultsImageUrl = uploadedUrl;
      }

      // 2. Salva la gara su Firestore
      await this.raceService.addRace(this.newRace);

      this.successMessage = 'Evento / Risultato pubblicato con successo!';
      this.resetForm();
    } catch (error) {
      this.errorMessage = 'Errore durante la pubblicazione. Riprova.';
    } finally {
      this.isUploading = false;
    }
  }

  private resetForm(): void {
    this.newRace = {
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
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
