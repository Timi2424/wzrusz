export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'reservation',
    question: 'Czy mogę od razu zarezerwować dekoracje online?',
    answer:
      'Nie — Wzrusz to nie sklep z koszykiem. Przeglądasz katalog, zbierasz pozycje na Dekoliście i wysyłasz zapytanie. ' +
      'Dopiero po kontakcie z nami i zatwierdzeniu terminu rezerwacja staje się wiążąca.',
  },
  {
    id: 'stock',
    question: 'Co oznacza stan magazynowy przy dekoracji?',
    answer:
      'To orientacyjna informacja, ile sztuk mamy w magazynie. Ostateczną dostępność na Twój termin ' +
      'potwierdzamy po otrzymaniu zapytania — inne wydarzenia mogą zajmować te same dekoracje w wybranych datach.',
  },
  {
    id: 'how-to-inquire',
    question: 'Jak wysłać zapytanie?',
    answer:
      'Wejdź w Katalog, dodaj dekoracje do Dekolisty, przejdź do formularza zapytania, uzupełnij termin, ' +
      'adres transportu lub montażu oraz dane kontaktowe. Przed wysłaniem zobaczysz podsumowanie wiadomości.',
  },
  {
    id: 'availability',
    question: 'Kiedy dowiem się, czy dekoracje są dostępne?',
    answer:
      'Odpowiadamy po przejrzeniu zapytania i kalendarza zajętości. Jeśli wszystko się zgadza, ' +
      'potwierdzimy rezerwację mailowo — nie od razu po kliknięciu „Wyślij zapytanie”.',
  },
  {
    id: 'area',
    question: 'W jakim obszarze działacie?',
    answer: 'Obsługujemy Poznań i okolice. W formularzu podaj adres montażu lub dostawy — na tej podstawie ustalimy szczegóły logistyki.',
  },
  {
    id: 'invoice',
    question: 'Czy wystawiacie fakturę?',
    answer:
      'Tak — w formularzu zapytania zaznacz „Potrzebuję faktury” i dopisz uwagi (np. NIP lub dane do faktury). ' +
      'Szczegóły ustalamy po zaakceptowaniu rezerwacji.',
  },
  {
    id: 'contact',
    question: 'Mam pytanie poza formularzem — jak się skontaktować?',
    answer:
      'Napisz na wzrusz.poznan@gmail.com lub zadzwoń pod +48 695 707 288. Formularz z Dekolisty pozostaje najszybszą drogą, ' +
      'gdy wiesz już, jakie dekoracje Cię interesują.',
  },
];
