import { Route } from '@angular/router';
import { ComingSoon } from './coming-soon';

export default [
  {
    path: '',
    component: ComingSoon,
    data: { title: 'FAQ' },
    title: 'FAQ — Wzrusz',
  },
] satisfies Route[];
