import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-create-report',
    templateUrl: './create-report.page.html',
    styleUrls: ['./create-report.page.scss'],
    standalone: false,
})
export class CreateReportPage {
    reportForm: FormGroup;
    loading = false;
    errorMessage = '';
    imageFile: File | null = null;

    categories = [
        { value: 'VOIRIE', label: 'Voirie' },
        { value: 'ECLAIRAGE', label: 'Éclairage' },
        { value: 'PROPRETE', label: 'Propreté' },
        { value: 'SIGNALISATION', label: 'Signalisation' },
        { value: 'ESPACES_VERTS', label: 'Espaces verts' },
        { value: 'MOBILIER_URBAIN', label: 'Mobilier urbain' },
        { value: 'GRAFFITI', label: 'Graffiti' },
        { value: 'NIDS_DE_POULE', label: 'Nids de poule' },
        { value: 'AUTRE', label: 'Autre' }
    ];

    constructor(
        private fb: FormBuilder,
        private reportService: ReportService,
        private router: Router,
        private alertController: AlertController,
        private loadingController: LoadingController
    ) {
        this.reportForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
            address: [''],
            city: ['']
        });
    }

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.imageFile = file;
        }
    }

    async onSubmit() {
        if (this.reportForm.valid && this.imageFile) {
            this.loading = true;
            this.errorMessage = '';
            const data = { ...this.reportForm.value, imageFile: this.imageFile };
            this.reportService.createReport(data).subscribe({
                next: async (res) => {
                    this.loading = false;
                    const alert = await this.alertController.create({
                        header: 'Succès',
                        message: 'Signalement créé avec succès !',
                        buttons: ['OK']
                    });
                    await alert.present();
                    this.router.navigate(['/dashboard'], { replaceUrl: true });
                },
                error: async (err) => {
                    this.loading = false;
                    this.errorMessage = err.error?.message || 'Erreur lors de la création du signalement.';
                    const alert = await this.alertController.create({
                        header: 'Erreur',
                        message: this.errorMessage,
                        buttons: ['OK']
                    });
                    await alert.present();
                }
            });
        } else {
            this.errorMessage = 'Veuillez remplir tous les champs et ajouter une photo.';
        }
    }
}
