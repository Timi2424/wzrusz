import { Route } from '@angular/router';
import { PublicShell } from './layouts/public-shell/public-shell';
import { ComingSoon } from './pages/coming-soon/coming-soon';
import { Home } from './pages/home/home';

export const appRoutes: Route[] = [
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
    ],
  },
];
