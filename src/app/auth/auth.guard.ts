import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    if (route.data['roles'] && route.data['roles'].includes('ROLE_ADMIN') && !authService.isAdmin()) {
      return router.createUrlTree(['/dashboard']);
    }

    if (route.data['roles'] && route.data['roles'].includes('ROLE_SCANNER') && !authService.isScanner()) {
      return router.createUrlTree(['/dashboard']);
    }

    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
