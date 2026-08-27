export type GameType = 'EA WRC' | 'Forza Motorsport' | 'MotoGP 26';
export type RaceStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Race {
  id?: string;
  title: string; // es. "Rally di Svezia" o "GP del Mugello"
  game: GameType; // Gioco di riferimento
  status: RaceStatus; // In arrivo, In corso, Conclusa
  startDate: string; // Data inizio evento
  endDate?: string; // Data fine evento
  registrationUrl?: string; // Link al Google Form
  resultsImageUrl?: string; // URL restituito da ImgBB
  description?: string; // Breve regolamento / dettagli tappa
  trackName?: string; // Nome circuito o location rally
}
