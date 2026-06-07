import { Route } from '@angular/router';
import { CatalogList } from './catalog-list';
import { CategoryDetailPage } from './category-detail';

export default [
  {
    path: '',
    component: CatalogList,
    title: 'Katalog — Wzrusz',
  },
  {
    path: ':slug',
    component: CategoryDetailPage,
    title: 'Kategoria — Wzrusz',
  },
] satisfies Route[];
