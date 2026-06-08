import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthSessionService } from './auth-session.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const session = inject(AuthSessionService);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  if (!session.token()) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (session.isAdmin()) {
    return true;
  }

  return authApi.loadCurrentUser().pipe(
    map(() => (session.isAdmin() ? true : router.createUrlTree(['/admin/login']))),
    catchError(() => {
      authApi.logout();
      return of(
        router.createUrlTree(['/admin/login'], {
          queryParams: { returnUrl: state.url },
        }),
      );
    }),
  );
};
