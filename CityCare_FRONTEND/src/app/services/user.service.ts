import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface PaginatedUsersResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: User[];
}

export interface UserStatsResponse {
    success: boolean;
    data: {
        total: number;
        active: number;
        inactive: number;
        byRole: Array<{ _id: 'ROLE_USER' | 'ROLE_ADMIN' | string; count: number }>;
    };
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(options?: { role?: string; page?: number; limit?: number }): Observable<PaginatedUsersResponse> {
        let params = new HttpParams();
        if (options?.role) params = params.set('role', options.role);
        if (options?.page) params = params.set('page', options.page);
        if (options?.limit) params = params.set('limit', options.limit);
        return this.http.get<PaginatedUsersResponse>(`${this.apiUrl}/users`, { params });
    }

    getUserById(id: string): Observable<{ success: boolean; data: User }> {
        return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/users/${id}`);
    }

    getStats(): Observable<UserStatsResponse> {
        return this.http.get<UserStatsResponse>(`${this.apiUrl}/users/stats`);
    }
}
