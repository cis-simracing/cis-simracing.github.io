import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameType, Race, RaceStatus } from '../../models/race.model';
import { RaceService } from '../../services/race.service';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.scss'],
})
export class RacesComponent implements OnInit {
  private raceService = inject(RaceService);

  private selectedGame$ = new BehaviorSubject<string>('ALL');
  private selectedStatus$ = new BehaviorSubject<string>('ALL');

  filteredRaces$!: Observable<Race[]>;

  currentSelectedGame = 'ALL';
  currentSelectedStatus = 'ALL';

  ngOnInit(): void {
    const allRaces$ = this.raceService.getAllRaces();

    this.filteredRaces$ = combineLatest([
      allRaces$,
      this.selectedGame$,
      this.selectedStatus$,
    ]).pipe(
      map(([races, selectedGame, selectedStatus]) =>
        races
          .filter((race) => {
            const matchGame =
              selectedGame === 'ALL' || race.game === selectedGame;
            const matchStatus =
              selectedStatus === 'ALL' || race.status === selectedStatus;
            return matchGame && matchStatus;
          })
          .sort((a, b) => b.startDate.localeCompare(a.startDate)),
      ),
    );
  }

  setGame(game: string): void {
    this.currentSelectedGame = game;
    this.selectedGame$.next(game);
  }

  setStatus(status: string): void {
    this.currentSelectedStatus = status;
    this.selectedStatus$.next(status);
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
