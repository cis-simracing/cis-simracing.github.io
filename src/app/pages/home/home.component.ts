import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
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

  ongoingRaces$!: Observable<Race[]>;
  upcomingRaces$!: Observable<Race[]>;

  ngOnInit(): void {
    // Condivide lo stesso stream Firestore tra le due sezioni della Home
    const allRaces$ = this.raceService.getAllRaces().pipe(shareReplay(1));

    // Filtra gare LIVE ordinate per data inizio
    this.ongoingRaces$ = allRaces$.pipe(
      map((races) =>
        races
          .filter((race) => race.status === 'ongoing')
          .sort((a, b) => a.startDate.localeCompare(b.startDate)),
      ),
    );

    // Filtra gare IN ARRIVO ordinate per data inizio
    this.upcomingRaces$ = allRaces$.pipe(
      map((races) =>
        races
          .filter((race) => race.status === 'upcoming')
          .sort((a, b) => a.startDate.localeCompare(b.startDate)),
      ),
    );
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
