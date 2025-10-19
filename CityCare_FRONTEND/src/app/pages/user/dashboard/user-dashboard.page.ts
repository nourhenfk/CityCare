import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { Auth } from '../../../services/auth';
import { Report } from '../../../models/report.model';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.page.html',
    styleUrls: ['./user-dashboard.page.scss'],
    standalone: false,
})
export class UserDashboardPage implements OnInit {
    loading = true;
    error: string | null = null;
    reports: Report[] = [];

    constructor(
        private reportService: ReportService,
        private authService: Auth,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.error = null;
        this.reportService.getReports({ page: 1, limit: 10, sortBy: '-createdAt' }).subscribe({
            next: (res) => {
                this.reports = res.data;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Impossible de charger vos signalements';
                this.loading = false;
            }
        });
    }

    async onLogout() {
        await this.authService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
    }

    goToCreateReport() {
        this.router.navigate(['/create-report']);
    }

    viewReportDetails(reportId: string) {
        this.router.navigate(['/report-detail', reportId]);
    }

    goToMap() {
        this.router.navigate(['/map']);
    }
}