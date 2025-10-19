import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateReportData, PaginatedResponse, Report, ReportStatsResponse } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getReports(options?: { status?: string; category?: string; page?: number; limit?: number; sortBy?: string }): Observable<PaginatedResponse<Report[]>> {
        let params = new HttpParams();
        if (options?.status) params = params.set('status', options.status);
        if (options?.category) params = params.set('category', options.category);
        if (options?.page) params = params.set('page', options.page);
        if (options?.limit) params = params.set('limit', options.limit);
        if (options?.sortBy) params = params.set('sortBy', options.sortBy);
        return this.http.get<PaginatedResponse<Report[]>>(`${this.apiUrl}/reports`, { params });
    }

    getReportById(id: string): Observable<{ success: boolean; data: Report }> {
        return this.http.get<{ success: boolean; data: Report }>(`${this.apiUrl}/reports/${id}`);
    }

    getStats(): Observable<ReportStatsResponse> {
        return this.http.get<ReportStatsResponse>(`${this.apiUrl}/reports/stats`);
    }

    createReport(data: CreateReportData): Observable<{ success: boolean; data: Report; message?: string }> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('latitude', String(data.latitude));
        formData.append('longitude', String(data.longitude));
        if (data.address) formData.append('address', data.address);
        if (data.city) formData.append('city', data.city);
        if (data.priority) formData.append('priority', data.priority);
        if (data.imageFile) formData.append('image', data.imageFile);
        return this.http.post<{ success: boolean; data: Report; message?: string }>(`${this.apiUrl}/reports`, formData);
    }

    updateReport(id: string, data: any): Observable<{ success: boolean; data: Report; message?: string }> {
        const formData = new FormData();
        if (data.status) formData.append('status', data.status);
        if (data.statusComment) formData.append('statusComment', data.statusComment);
        if (data.priority) formData.append('priority', data.priority);
        if (data.assignedTo) formData.append('assignedTo', data.assignedTo);
        if (data.title) formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        if (data.resolutionImage) formData.append('image', data.resolutionImage);
        return this.http.put<{ success: boolean; data: Report; message?: string }>(`${this.apiUrl}/reports/${id}`, formData);
    }
}
