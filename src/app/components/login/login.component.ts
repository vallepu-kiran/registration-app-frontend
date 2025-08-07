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
    <div class="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <div class="card shadow-lg border-0 fade-in">
              <div class="card-body p-4 p-sm-5">
                <div class="text-center mb-4">
                  <div class="mb-3">
                    <div class="user-avatar mx-auto" style="width: 60px; height: 60px; font-size: 1.5rem;">
                      <i class="fas fa-user"></i>
                    </div>
                  </div>
                  <h2 class="card-title h3 mb-2">Welcome Back</h2>
                  <p class="text-muted mb-0">Sign in to your account</p>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
                  <div class="mb-3">
                    <label for="email" class="form-label fw-medium">Email Address</label>
                    <input
                      type="email"
                      class="form-control form-control-lg"
                      id="email"
                      formControlName="email"
                      placeholder="Enter your email"
                      autocomplete="email"
                      [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                      <div *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</div>
                      <div *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password" class="form-label fw-medium">Password</label>
                    <input
                      type="password"
                      class="form-control form-control-lg"
                      id="password"
                      formControlName="password"
                      placeholder="Enter your password"
                      autocomplete="current-password"
                      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                      Password is required
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 mb-3"
                    [disabled]="loginForm.invalid || isLoading"
                  >
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Signing in...' : 'Sign In' }}
                  </button>
                </form>

                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Don't have an account?
                    <a routerLink="/register" class="text-decoration-none fw-medium ms-1">Sign up</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .card {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .form-control-lg {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
    
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
    }
    
    @media (max-width: 575.98px) {
      .card-body {
        padding: 2rem 1.5rem !important;
      }
      
      .h3 {
        font-size: 1.5rem;
      }
    }
    
    .fade-in {
      animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
