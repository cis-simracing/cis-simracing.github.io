import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameType } from '../../models/race.model';

export interface GalleryItem {
  id: string;
  title: string;
  game: GameType;
  date: string;
  imageUrl: string;
  description?: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  selectedGame: string = 'ALL';
  selectedImage: GalleryItem | null = null;

  // Dati mockup di anteprima (verranno poi sincronizzati con Firestore/ImgBB)
  galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Classifica Ufficiale - Rally di Svezia',
      game: 'EA WRC',
      date: '2026-08-20',
      imageUrl:
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      description: 'Tempi finali e classifica assoluta dopo la Power Stage.',
    },
    {
      id: '2',
      title: 'Podio Finale - 6H Le Mans Endurance',
      game: 'Forza Motorsport',
      date: '2026-08-15',
      imageUrl:
        'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
      description:
        'I primi tre equipaggi classificati nella categoria Hypercar.',
    },
    {
      id: '3',
      title: 'Ordine di Arrivo - GP del Mugello',
      game: 'MotoGP 26',
      date: '2026-08-10',
      imageUrl:
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      description: 'Risultati di gara con distacchi e giro veloce.',
    },
  ];

  get filteredItems(): GalleryItem[] {
    if (this.selectedGame === 'ALL') {
      return this.galleryItems;
    }
    return this.galleryItems.filter((item) => item.game === this.selectedGame);
  }

  setFilter(game: string): void {
    this.selectedGame = game;
  }

  openModal(item: GalleryItem): void {
    this.selectedImage = item;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
}
