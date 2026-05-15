import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const telegramGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isOpenedInTelegram()) {
    return true;
  }

  // Not in Telegram → redirect to forbidden page
  return router.createUrlTree(['/forbidden']);
};