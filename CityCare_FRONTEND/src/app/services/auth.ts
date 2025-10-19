import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';
import { User, LoginResponse, LoginCredentials, RegisterData } from '../models/user.model';

/**
 * Service d'Authentification
 * Gère la connexion, l'inscription, le stockage du token et l'état de l'utilisateur
 */
@Injectable({
  providedIn: 'root'
})
export class Auth {
  // URL de base de l'API
  private apiUrl = environment.apiUrl;

  // Clé pour le stockage du token
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // BehaviorSubject pour suivre l'état de l'utilisateur connecté
  // BehaviorSubject permet d'émettre une valeur initiale et de partager cette valeur avec tous les abonnés
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // BehaviorSubject pour suivre l'état d'authentification
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private http: HttpClient) {
    // Initialisation des BehaviorSubjects avec null/false
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Charger l'utilisateur depuis le stockage au démarrage
    this.loadStoredUser();
  }

  /**
   * Charge l'utilisateur stocké localement
   */
  private async loadStoredUser(): Promise<void> {
    try {
      const token = await this.getToken();
      const userJson = await Preferences.get({ key: this.USER_KEY });

      if (token && userJson.value) {
        const user: User = JSON.parse(userJson.value);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap((response) => {
          if (response?.success && response.data?.token) {
            this.storeAuthData(response.data.token, response.data.user);
          }
        })
      );
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response?.success && response.data?.token) {
            this.storeAuthData(response.data.token, response.data.user);
          }
        })
      );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<void> {
    // Supprimer le token et l'utilisateur du stockage
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: this.USER_KEY });

    // Mettre à jour les BehaviorSubjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  getProfile(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`)
      .pipe(
        map((response) => response.data as User),
        tap((user) => {
          this.currentUserSubject.next(user);
          this.storeUser(user);
        })
      );
  }

  /**
   * Stocker le token et l'utilisateur
   */
  private async storeAuthData(token: string, user: User): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
    await this.storeUser(user);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Stocker l'utilisateur
   */
  private async storeUser(user: User): Promise<void> {
    await Preferences.set({ key: this.USER_KEY, value: JSON.stringify(user) });
  }

  /**
   * Obtenir le token stocké
   */
  async getToken(): Promise<string | null> {
    const result = await Preferences.get({ key: this.TOKEN_KEY });
    return result.value;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Obtenir l'utilisateur actuel (valeur synchrone)
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est admin (robuste aux refresh)
   */
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ROLE_ADMIN';
  }

  /**
   * Décoder un JWT (sans vérification) pour extraire le payload
   */
  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (_) {
      return null;
    }
  }

  /**
   * Vérifie de façon asynchrone si l'utilisateur est admin.
   * - Si currentUser est présent, on l'utilise
   * - Sinon, on tente de lire le rôle depuis le token
   * - Sinon, on appelle /auth/me pour récupérer le profil
   */
  async checkAdmin(): Promise<boolean> {
    // 1) Si on a déjà un user en mémoire
    const user = this.currentUserValue;
    if (user) {
      return user.role === 'ROLE_ADMIN';
    }

    // 2) Tenter depuis le token
    const token = await this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      if (payload?.role) {
        const isAdmin = payload.role === 'ROLE_ADMIN';
        // Mettre à jour état minimal si possible
        if (!this.isAuthenticatedSubject.value) this.isAuthenticatedSubject.next(true);
        if (isAdmin && !this.currentUserSubject.value) {
          // Créer un utilisateur minimal valide selon l'interface User
          const minimalUser: User = {
            id: payload.sub || payload.id || '',
            role: 'ROLE_ADMIN',
            name: payload.name || 'Admin',
            email: payload.email || ''
          };
          this.currentUserSubject.next(minimalUser);
        }
        return isAdmin;
      }
    }

    // 3) Fallback: appeler /auth/me
    try {
      const profile = await this.getProfile().toPromise();
      return profile?.role === 'ROLE_ADMIN';
    } catch (_) {
      return false;
    }
  }
}
