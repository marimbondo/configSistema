import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitting = true;
    const loading = await this.loadingCtrl.create({
      message: 'Entrando...'
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      await loading.dismiss();
      this.router.navigate(['/home']);
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Credenciais inválidas. Tente novamente.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.submitting = false;
    }
  }
}