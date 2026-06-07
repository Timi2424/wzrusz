import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

export const inquiryGuard: CanActivateFn = () => {
  const store = inject(DekolistaStore);
  const router = inject(Router);

  if (store.isEmpty()) {
    return router.createUrlTree(['/dekolista']);
  }

  return true;
};
