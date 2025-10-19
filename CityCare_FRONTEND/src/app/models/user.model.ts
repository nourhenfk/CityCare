/**
 * Interface User - Représente un utilisateur de l'application
 */
export interface User {
    id: string;        // backend returns id
    name: string;      // single name field
    email: string;
    phone?: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN';
    avatar?: string;
    createdAt?: string;
}

/**
 * Interface pour la réponse de connexion
 */
export interface LoginResponse {
    success: boolean;
    message?: string;
    data: {
        user: User;
        token: string;
    };
}

/**
 * Interface pour les credentials de connexion
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Interface pour l'inscription
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'ROLE_USER' | 'ROLE_ADMIN';
}
