import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Admin: CSR only — no SEO, fewer SSR pitfalls (auth, PrimeNG).
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  // Public catalog + inquiry: SSR per request for SEO and dynamic meta.
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
