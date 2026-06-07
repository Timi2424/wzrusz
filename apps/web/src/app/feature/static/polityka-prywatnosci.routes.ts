import { Route } from '@angular/router';
import { ComingSoon } from './coming-soon';

export default [
  {
    path: '',
    component: ComingSoon,
    data: { title: 'Polityka prywatności' },
    title: 'Polityka prywatności — Wzrusz',
  },
] satisfies Route[];
