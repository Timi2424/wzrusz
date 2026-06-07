import { Route } from '@angular/router';
import { ComingSoon } from './coming-soon';

export default [
  {
    path: '',
    component: ComingSoon,
    data: { title: 'Formularz zapytania' },
    title: 'Zapytanie — Wzrusz',
  },
] satisfies Route[];
