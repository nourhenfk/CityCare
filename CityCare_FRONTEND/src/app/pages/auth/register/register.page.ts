import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router,
    private alertController: AlertController
  ) {
    // Initialiser le formulaire avec validation
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
  }

  /**
   * Validateur personnalisé pour vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  /**
   * Afficher/masquer le mot de passe
   */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Afficher/masquer la confirmation du mot de passe
   */
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Soumettre le formulaire d'inscription
   */
  async onRegister() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Extraire les données du formulaire (sans confirmPassword)
      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: async (response) => {
          this.loading = false;

          // Afficher un message de succès
          const alert = await this.alertController.create({
            header: 'Inscription réussie !',
            message: 'Votre compte a été créé avec succès. Bienvenue sur CityCare !',
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
          this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';

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
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Naviguer vers la page de connexion
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
