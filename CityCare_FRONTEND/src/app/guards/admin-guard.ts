import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard pour protéger les routes admin
 */
export const adminGuard: CanActivateFn = async (route, state) => {
    const authService = inject(Auth);
    const router = inject(Router);

    const isLoggedIn = await authService.isLoggedIn();
    if (!isLoggedIn) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // Vérification robuste (peut décoder le token ou récupérer le profil)
    const isAdmin = await authService.checkAdmin();
    if (!isAdmin) {
        router.navigate(['/dashboard']);
        return false;
    }

    return true;
};
