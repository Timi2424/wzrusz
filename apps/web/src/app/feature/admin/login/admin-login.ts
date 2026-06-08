import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../../core/auth/auth-api.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();
    this.authApi
      .login({ email, password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          if (response.user.role !== 'admin') {
            this.authApi.logout();
            this.error.set('Brak uprawnień administratora.');
            return;
          }
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin';
          void this.router.navigateByUrl(returnUrl);
        },
        error: () => {
          this.error.set('Nieprawidłowy email lub hasło.');
        },
      });
  }
}
