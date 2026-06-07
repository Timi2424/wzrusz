import { Route } from '@angular/router';
import { ComingSoon } from './coming-soon';

export default [
  {
    path: '',
    component: ComingSoon,
    data: { title: 'Regulamin' },
    title: 'Regulamin — Wzrusz',
  },
] satisfies Route[];
