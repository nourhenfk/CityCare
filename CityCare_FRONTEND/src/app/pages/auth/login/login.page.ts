import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  loginForm: FormGroup; // Formulaire réactif
  showPassword = false; // Afficher/masquer le mot de passe
  loading = false; // État de chargement
  errorMessage = ''; // Message d'erreur

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    // Initialiser le formulaire avec validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Vérifier si l'utilisateur est déjà connecté
    this.checkAuthentication();
  }

  /**
   * Vérifier si l'utilisateur est déjà connecté
   */
  async checkAuthentication() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      // Rediriger selon le rôle si déjà connecté
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin'], { replaceUrl: true });
      } else {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }
    }
  }

  /**
   * Afficher/masquer le mot de passe
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Soumettre le formulaire de connexion
   */
  async onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: async (response) => {
          this.loading = false;

          // Afficher un message de succès
          const alert = await this.alertController.create({
            header: 'Succès',
            message: 'Connexion réussie !',
            buttons: ['OK']
          });
          await alert.present();

          // Rediriger selon le rôle: admin -> /admin, user -> /dashboard
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
        },
        error: async (error) => {
          this.loading = false;

          // Afficher le message d'erreur
          this.errorMessage = error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';

          const alert = await this.alertController.create({
            header: 'Erreur',
            message: this.errorMessage,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Naviguer vers la page d'inscription
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
