import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Race } from '../../models/race.model';
import { RaceService } from '../../services/race.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  private raceService = inject(RaceService);

  private selectedGame$ = new BehaviorSubject<string>('ALL');
  currentSelectedGame = 'ALL';
  selectedImage: Race | null = null;

  filteredItems$!: Observable<Race[]>;

  ngOnInit(): void {
    this.filteredItems$ = combineLatest([
      this.raceService.getAllRaces(),
      this.selectedGame$,
    ]).pipe(
      map(([races, filter]) =>
        races
          // Mostra solo le gare che hanno un'immagine risultati caricata
          .filter((r) => !!r.resultsImageUrl)
          .filter((r) => filter === 'ALL' || r.game === filter)
          .sort((a, b) => b.startDate.localeCompare(a.startDate)),
      ),
    );
  }

  setFilter(game: string): void {
    this.currentSelectedGame = game;
    this.selectedGame$.next(game);
  }

  openModal(item: Race): void {
    this.selectedImage = item;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
}
