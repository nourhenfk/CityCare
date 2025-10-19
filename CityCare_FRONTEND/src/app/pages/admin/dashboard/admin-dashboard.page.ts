import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { UserService } from '../../../services/user.service';
import { Auth } from '../../../services/auth';
import { Report, ReportStatsResponse } from '../../../models/report.model';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.page.html',
    styleUrls: ['./admin-dashboard.page.scss'],
    standalone: false,
})
export class AdminDashboardPage implements OnInit {
    loading = true;
    error: string | null = null;

    // Stats
    totalReports = 0;
    byStatus: Array<{ _id: string; count: number }> = [];
    byCategory: Array<{ _id: string; count: number }> = [];
    recentReports: Report[] = [];

    // User stats
    totalUsers = 0;
    activeUsers = 0;
    inactiveUsers = 0;
    byRole: Array<{ _id: string; count: number }> = [];

    constructor(
        private reportService: ReportService,
        private userService: UserService,
        private authService: Auth,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.error = null;

        this.reportService.getStats().subscribe({
            next: (res) => {
                this.totalReports = res.data.total;
                this.byStatus = res.data.byStatus;
                this.byCategory = res.data.byCategory;
                this.recentReports = res.data.recentReports;
            },
            error: (err) => {
                this.error = err.error?.message || 'Impossible de charger les statistiques des signalements';
            }
        });

        this.userService.getStats().subscribe({
            next: (res) => {
                this.totalUsers = res.data.total;
                this.activeUsers = res.data.active;
                this.inactiveUsers = res.data.inactive;
                this.byRole = res.data.byRole;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'Impossible de charger les statistiques des utilisateurs';
                this.loading = false;
            }
        });
    }

    async onLogout() {
        await this.authService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
    }

    viewReportDetails(reportId: string) {
        this.router.navigate(['/report-detail', reportId]);
    }

    goToMap() {
        this.router.navigate(['/map']);
    }
}
