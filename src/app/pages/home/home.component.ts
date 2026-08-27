import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Race, GameType } from '../../models/race.model';
import { RaceService } from '../../services/race.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private raceService = inject(RaceService);

  // Dati di fallback per vedere l'anteprima se Firestore non è ancora popolato
  ongoingRaces$: Observable<Race[]> = of([
    {
      id: '1',
      title: 'Rally di Svezia - Tappa 2',
      game: 'EA WRC',
      status: 'ongoing',
      startDate: '2026-08-25',
      endDate: '2026-08-31',
      trackName: 'Värmland Snow Stages',
      registrationUrl: 'https://forms.google.com',
      description:
        'Condizioni meteo estreme su neve e ghiaccio. Classe Rally1.',
    },
    {
      id: '2',
      title: 'Endurance Series - 6H Le Mans',
      game: 'Forza Motorsport',
      status: 'ongoing',
      startDate: '2026-08-28',
      endDate: '2026-08-30',
      trackName: 'Circuit de la Sarthe',
      registrationUrl: 'https://forms.google.com',
      description: 'Categoria Hypercar & GT3. Cambio pilota e meteo dinamico.',
    },
  ]);

  upcomingRaces$: Observable<Race[]> = of([
    {
      id: '3',
      title: 'GP del Mugello',
      game: 'MotoGP 26',
      status: 'upcoming',
      startDate: '2026-09-05',
      trackName: 'Autodromo Internazionale del Mugello',
      registrationUrl: 'https://forms.google.com',
      description: 'Prima tappa del campionato autunnale su due ruote.',
    },
  ]);

  ngOnInit(): void {
    // Quando Firestore sarà popolato, potrai sbloccare:
    // this.ongoingRaces$ = this.raceService.getAllRaces().pipe(
    //   map(races => races.filter(r => r.status === 'ongoing'))
    // );
  }

  getGameBadgeClass(game: GameType): string {
    switch (game) {
      case 'EA WRC':
        return 'badge-wrc';
      case 'Forza Motorsport':
        return 'badge-forza';
      case 'MotoGP 26':
        return 'badge-motogp';
      default:
        return 'badge-default';
    }
  }
}
