import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard pour protéger les routes qui nécessitent une authentification
 * Si l'utilisateur n'est pas connecté, il sera redirigé vers la page de login
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn();

  if (!isLoggedIn) {
    // Rediriger vers la page de login si non connecté
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};
