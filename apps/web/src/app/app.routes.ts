import { Route } from '@angular/router';
import { PublicShell } from './layout/shell/public-shell';

export const appRoutes: Route[] = [
  {
    path: '',
    component: PublicShell,
    children: [
      {
        path: '',
        loadChildren: () => import('./feature/home/home.routes'),
      },
      {
        path: 'katalog',
        loadChildren: () => import('./feature/catalog/catalog.routes'),
      },
      {
        path: 'dekolista',
        loadChildren: () => import('./feature/dekolista/dekolista.routes'),
      },
      {
        path: 'zapytanie',
        loadChildren: () => import('./feature/inquiry/inquiry.routes'),
      },
      {
        path: 'faq',
        loadChildren: () => import('./feature/static/faq.routes'),
      },
      {
        path: 'polityka-prywatnosci',
        loadChildren: () => import('./feature/static/polityka-prywatnosci.routes'),
      },
      {
        path: 'regulamin',
        loadChildren: () => import('./feature/static/regulamin.routes'),
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./feature/admin/admin.routes'),
  },
];
