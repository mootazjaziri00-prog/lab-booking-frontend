import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.toast.show('Compte créé, connectez-vous');
        this.router.navigate(['/login']);
      },
      error: (err) => this.toast.show(err.error?.message || 'Erreur', 'error'),
    });
  }
}
