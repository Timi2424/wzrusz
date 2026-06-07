import { Route } from '@angular/router';
import { PublicShell } from './layout/shell/public-shell';
import { ComingSoon } from './pages/coming-soon/coming-soon';
import { Home } from './pages/home/home';

export const publicRoutes: Route[] = [
  {
    path: '',
    component: PublicShell,
    children: [
      {
        path: '',
        component: Home,
        title: 'Wzrusz — wypożyczalnia dekoracji na eventy',
      },
      {
        path: 'katalog',
        component: ComingSoon,
        data: { title: 'Katalog' },
        title: 'Katalog — Wzrusz',
      },
      {
        path: 'dekolista',
        component: ComingSoon,
        data: { title: 'Dekolista' },
        title: 'Dekolista — Wzrusz',
      },
      {
        path: 'faq',
        component: ComingSoon,
        data: { title: 'FAQ' },
        title: 'FAQ — Wzrusz',
      },
      {
        path: 'polityka-prywatnosci',
        component: ComingSoon,
        data: { title: 'Polityka prywatności' },
        title: 'Polityka prywatności — Wzrusz',
      },
      {
        path: 'regulamin',
        component: ComingSoon,
        data: { title: 'Regulamin' },
        title: 'Regulamin — Wzrusz',
      },
    ],
  },
];
