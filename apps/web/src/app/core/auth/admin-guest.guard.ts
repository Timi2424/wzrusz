import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from './auth-session.service';

/** Redirect logged-in admins away from the login page. */
export const adminGuestGuard: CanActivateFn = () => {
  const session = inject(AuthSessionService);
  const router = inject(Router);

  if (session.isAdmin()) {
    return router.createUrlTree(['/admin']);
  }

  return true;
};
