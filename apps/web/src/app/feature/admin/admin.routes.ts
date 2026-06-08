import { Route } from '@angular/router';
import { adminGuard } from '../../core/auth/admin.guard';
import { adminGuestGuard } from '../../core/auth/admin-guest.guard';
import { AdminShell } from '../../layout/shell/admin-shell';
import { AdminDashboardPage } from './dashboard/admin-dashboard';
import { AdminInquiryListPage } from './inquiries/admin-inquiry-list';
import { AdminLoginPage } from './login/admin-login';

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
    ],
  },
] satisfies Route[];
