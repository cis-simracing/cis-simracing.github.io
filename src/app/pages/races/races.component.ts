import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameType, Race, RaceStatus } from '../../models/race.model';
import { RaceService } from '../../services/race.service';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.scss'],
})
export class RacesComponent {
  private raceService = inject(RaceService);

  selectedGame: string = 'ALL';
  selectedStatus: string = 'ALL';

  // Dati di prova (saranno popolati in tempo reale da Firestore)
  races: Race[] = [
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
    {
      id: '4',
      title: 'Rally del Portogallo',
      game: 'EA WRC',
      status: 'upcoming',
      startDate: '2026-09-12',
      endDate: '2026-09-15',
      trackName: 'Fafe & Arganil',
      registrationUrl: 'https://forms.google.com',
      description: 'Sterrato duro e salti spettacolari.',
    },
    {
      id: '5',
      title: 'Sprint Cup - Monza',
      game: 'Forza Motorsport',
      status: 'completed',
      startDate: '2026-08-10',
      endDate: '2026-08-10',
      trackName: 'Autodromo Nazionale Monza',
      description: 'Gara secca da 45 minuti con sosta obbligatoria.',
    },
  ];

  get filteredRaces(): Race[] {
    return this.races.filter((race) => {
      const matchGame =
        this.selectedGame === 'ALL' || race.game === this.selectedGame;
      const matchStatus =
        this.selectedStatus === 'ALL' || race.status === this.selectedStatus;
      return matchGame && matchStatus;
    });
  }

  setGame(game: string): void {
    this.selectedGame = game;
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
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
}
