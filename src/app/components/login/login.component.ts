import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="card-title">Welcome Back</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                    <div *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                    Password is required
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  [disabled]="loginForm.invalid || isLoading"
                >
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </button>
              </form>

              <div class="text-center mt-3">
                <p class="mb-0">
                  Don't have an account?
                  <a routerLink="/register" class="text-decoration-none">Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
    
    .card {
      border: none;
      border-radius: 10px;
    }
    
    .form-control {
      border-radius: 8px;
      padding: 12px;
    }
    
    .btn {
      border-radius: 8px;
      padding: 12px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}
