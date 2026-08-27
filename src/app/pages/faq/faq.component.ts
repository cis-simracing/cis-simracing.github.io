import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  category: 'iscrizioni' | 'regolamento' | 'hardware';
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  selectedCategory: string = 'ALL';

  faqs: FaqItem[] = [
    {
      question: 'Come posso iscrivermi alle gare o ai campionati CIS?',
      answer:
        'Basta consultare la sezione "Gare in corso" o "Campionati" sul sito e cliccare sul pulsante "Modulo Iscrizione (Google Form)". Compila i campi richiesti (Gamertag/PSN ID, piattaforma, auto/moto scelta) prima della chiusura delle registrazioni.',
      category: 'iscrizioni',
      isOpen: true,
    },
    {
      question: 'È necessario possedere un volante per partecipare?',
      answer:
        'No! Tutte le nostre competizioni sono aperte sia a chi guida con volante/pedaliera, sia a chi utilizza il controller. La classificazione è unica per garantire il massimo divertimento.',
      category: 'hardware',
      isOpen: false,
    },
    {
      question: 'Quali sono le regole di condotta e i contatti in pista?',
      answer:
        'Vige la regola del rispetto e del fair play. Nelle gare su pista (Forza Motorsport e MotoGP 26), i cambi di direzione multipli in rettilineo e le staccate kamikaze con contatto sono sanzionati dalla Direzione Gara con penalità in secondi o posizioni in griglia.',
      category: 'regolamento',
      isOpen: false,
    },
    {
      question: 'Come funzionano le tappe su EA WRC?',
      answer:
        'I campionati Rally si svolgono tramite Club EA ufficiale o tappe a tempo prestabilite. I piloti hanno a disposizione una finestra temporale (generalmente da giovedì a domenica) per completare le prove speciali e registrare il tempo.',
      category: 'regolamento',
      isOpen: false,
    },
    {
      question: 'Come e dove vengono pubblicati i risultati ufficiali?',
      answer:
        'Al termine di ogni evento e dopo le eventuali verifiche dei commissari, i risultati, i distacchi e le foto dei podi vengono pubblicati nella sezione "Risultati & Foto" di questo sito.',
      category: 'iscrizioni',
      isOpen: false,
    },
    {
      question:
        'Posso partecipare anche se non posso garantire la presenza a tutte le gare?',
      answer:
        'Certamente. I nostri campionati prevedono una classifica a punti generale, ma è possibile iscriversi anche come pilota "Wildcard" per singole tappe di tuo gradimento.',
      category: 'iscrizioni',
      isOpen: false,
    },
  ];

  get filteredFaqs(): FaqItem[] {
    if (this.selectedCategory === 'ALL') {
      return this.faqs;
    }
    return this.faqs.filter((faq) => faq.category === this.selectedCategory);
  }

  toggleFaq(faq: FaqItem): void {
    faq.isOpen = !faq.isOpen;
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }
}
