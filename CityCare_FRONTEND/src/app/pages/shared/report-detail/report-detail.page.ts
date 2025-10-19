import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { Auth } from '../../../services/auth';
import { Report } from '../../../models/report.model';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.page.html',
  styleUrls: ['./report-detail.page.scss'],
  standalone: false,
})
export class ReportDetailPage implements OnInit {
  reportId: string = '';
  report: Report | null = null;
  loading = true;
  error: string | null = null;
  isAdmin = false;

  // Pour la modification de statut
  showStatusForm = false;
  selectedStatus: string = '';
  statusComment: string = '';
  resolutionImage: File | null = null;

  statusOptions = [
    { value: 'OUVERT', label: 'Ouvert', color: 'medium' },
    { value: 'EN_COURS', label: 'En cours', color: 'warning' },
    { value: 'RESOLU', label: 'Résolu', color: 'success' },
    { value: 'REJETE', label: 'Rejeté', color: 'danger' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private authService: Auth,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('id') || '';
    this.isAdmin = this.authService.isAdmin();
    if (this.reportId) {
      this.loadReport();
    }
  }

  loadReport() {
    this.loading = true;
    this.error = null;
    this.reportService.getReportById(this.reportId).subscribe({
      next: (res) => {
        this.report = res.data;
        this.selectedStatus = this.report.status;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Impossible de charger le signalement';
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const option = this.statusOptions.find(s => s.value === status);
    return option?.color || 'medium';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(s => s.value === status);
    return option?.label || status;
  }

  toggleStatusForm() {
    this.showStatusForm = !this.showStatusForm;
  }

  onResolutionImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resolutionImage = file;
    }
  }

  async updateStatus() {
    if (!this.report || this.selectedStatus === this.report.status) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Mise à jour du statut...'
    });
    await loading.present();

    const formData: any = {
      status: this.selectedStatus,
      statusComment: this.statusComment
    };

    // Si résolu et qu'il y a une image de résolution
    if (this.selectedStatus === 'RESOLU' && this.resolutionImage) {
      formData.resolutionImage = this.resolutionImage;
    }

    this.reportService.updateReport(this.reportId, formData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.report = res.data;
        this.showStatusForm = false;
        this.statusComment = '';
        this.resolutionImage = null;

        const alert = await this.alertController.create({
          header: 'Succès',
          message: 'Statut mis à jour avec succès',
          buttons: ['OK']
        });
        await alert.present();
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: err.error?.message || 'Impossible de mettre à jour le statut',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goBack() {
    this.router.navigate([this.isAdmin ? '/admin' : '/dashboard']);
  }
}
