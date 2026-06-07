import { Route } from '@angular/router';
import { inquiryGuard } from './inquiry.guard';
import { InquiryFormPage } from './inquiry-form';

export default [
  {
    path: '',
    component: InquiryFormPage,
    canActivate: [inquiryGuard],
    title: 'Zapytanie — Wzrusz',
  },
] satisfies Route[];
