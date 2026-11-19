import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPwd = signal(false);
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value as any).subscribe({
      next: (res) => {
        this.toast.show(`Bienvenue ${res.user.name} 👋`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur de connexion', 'error'),
    });
  }
}
