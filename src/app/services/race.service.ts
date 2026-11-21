import { Injectable, NgZone, inject } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Query,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { firebaseDb } from '../firebase';
import { Race, GameType } from '../models/race.model';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  private ngZone = inject(NgZone);
  private racesCollection = collection(firebaseDb, 'races');

  // Converte un listener onSnapshot di Firestore in Observable sincronizzato con NgZone
  private listenQuery(q: Query): Observable<Race[]> {
    return new Observable<Race[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const races: Race[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Race, 'id'>),
          }));
          this.ngZone.run(() => subscriber.next(races));
        },
        (error) => {
          console.error('Errore lettura Firestore:', error);
          this.ngZone.run(() => subscriber.error(error));
        },
      );

      return () => unsubscribe();
    });
  }

  // Recupera tutte le gare in tempo reale
  getAllRaces(): Observable<Race[]> {
    return this.listenQuery(this.racesCollection);
  }

  // Filtra gare per gioco (EA WRC, Forza, MotoGP 26)
  getRacesByGame(game: GameType): Observable<Race[]> {
    const q = query(this.racesCollection, where('game', '==', game));
    return this.listenQuery(q);
  }

  // Aggiungi una nuova gara
  addRace(race: Race) {
    return addDoc(this.racesCollection, race);
  }

  // Aggiorna gara (es. cambiare stato o inserire URL foto risultati)
  updateRace(id: string, race: Partial<Race>) {
    const raceDocRef = doc(firebaseDb, `races/${id}`);
    return updateDoc(raceDocRef, race);
  }

  // Elimina gara
  deleteRace(id: string) {
    const raceDocRef = doc(firebaseDb, `races/${id}`);
    return deleteDoc(raceDocRef);
  }
}
