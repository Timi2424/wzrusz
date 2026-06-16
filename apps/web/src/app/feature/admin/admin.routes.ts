import { Route } from '@angular/router';
import { adminGuard } from '../../core/auth/admin.guard';
import { adminGuestGuard } from '../../core/auth/admin-guest.guard';
import { AdminShell } from '../../layout/shell/admin-shell';
import { AdminCategoryCreatePage } from './catalog/admin-category-create';
import { AdminCategoryDetailPage } from './catalog/admin-category-detail';
import { AdminCategoryListPage } from './catalog/admin-category-list';
import { AdminDecorationFormPage } from './catalog/admin-decoration-form';
import { AdminDashboardPage } from './dashboard/admin-dashboard';
import { AdminInquiryDetailPage } from './inquiries/admin-inquiry-detail';
import { AdminInquiryListPage } from './inquiries/admin-inquiry-list';
import { AdminLoginPage } from './login/admin-login';
import { AdminSchedulerPage } from './scheduler/admin-scheduler';

export default [
  {
    path: 'login',
    component: AdminLoginPage,
    canActivate: [adminGuestGuard],
    title: 'Logowanie — Wzrusz Admin',
  },
  {
    path: '',
    component: AdminShell,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardPage,
        title: 'Panel — Wzrusz',
      },
      {
        path: 'zapytania',
        component: AdminInquiryListPage,
        title: 'Zapytania — Wzrusz Admin',
      },
      {
        path: 'zapytania/:id',
        component: AdminInquiryDetailPage,
        title: 'Szczegóły zapytania — Wzrusz Admin',
      },
      {
        path: 'katalog',
        component: AdminCategoryListPage,
        title: 'Katalog — Wzrusz Admin',
      },
      {
        path: 'katalog/nowa',
        component: AdminCategoryCreatePage,
        title: 'Nowa kategoria — Wzrusz Admin',
      },
      {
        path: 'katalog/kategorie/:categoryId/dekoracje/nowa',
        component: AdminDecorationFormPage,
        title: 'Nowa dekoracja — Wzrusz Admin',
      },
      {
        path: 'katalog/kategorie/:id',
        component: AdminCategoryDetailPage,
        title: 'Kategoria — Wzrusz Admin',
      },
      {
        path: 'katalog/dekoracje/:id',
        component: AdminDecorationFormPage,
        title: 'Dekoracja — Wzrusz Admin',
      },
      {
        path: 'scheduler',
        component: AdminSchedulerPage,
        title: 'Scheduler — Wzrusz Admin',
      },
    ],
  },
] satisfies Route[];
