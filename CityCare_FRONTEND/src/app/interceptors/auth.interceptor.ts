import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

/**
 * Intercepteur HTTP pour ajouter le token JWT aux requêtes
 * et gérer les erreurs d'authentification
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: Auth,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Convertir la Promise du token en Observable
        return from(this.authService.getToken()).pipe(
            switchMap(token => {
                // Si on a un token, on l'ajoute au header
                if (token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                }

                // Continuer avec la requête modifiée
                return next.handle(request).pipe(
                    catchError((error: HttpErrorResponse) => {
                        // Si erreur 401 (non autorisé), déconnecter l'utilisateur
                        if (error.status === 401) {
                            this.authService.logout();
                            this.router.navigate(['/login']);
                        }
                        return throwError(() => error);
                    })
                );
            })
        );
    }
}
