import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Race, GameType } from '../models/race.model';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  private firestore = inject(Firestore);
  private racesCollection = collection(this.firestore, 'races');

  // Recupera tutte le gare in tempo reale
  getAllRaces(): Observable<Race[]> {
    return collectionData(this.racesCollection, {
      idField: 'id',
    }) as Observable<Race[]>;
  }

  // Filtra gare per gioco (EA WRC, Forza, MotoGP 26)
  getRacesByGame(game: GameType): Observable<Race[]> {
    const q = query(this.racesCollection, where('game', '==', game));
    return collectionData(q, { idField: 'id' }) as Observable<Race[]>;
  }

  // Aggiungi una nuova gara
  addRace(race: Race) {
    return addDoc(this.racesCollection, race);
  }

  // Aggiorna gara (es. cambiare stato o inserire URL foto risultati)
  updateRace(id: string, race: Partial<Race>) {
    const raceDocRef = doc(this.firestore, `races/${id}`);
    return updateDoc(raceDocRef, race);
  }

  // Elimina gara
  deleteRace(id: string) {
    const raceDocRef = doc(this.firestore, `races/${id}`);
    return deleteDoc(raceDocRef);
  }
}
