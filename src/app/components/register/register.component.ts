import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h2 class="card-title">Create Account</h2>
                <p class="text-muted">Join us today</p>
              </div>

              <div class="alert alert-success" *ngIf="successMessage">
                {{ successMessage }}
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      formControlName="firstName"
                      [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                      First name is required
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      formControlName="lastName"
                      [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                    >
                    <div class="invalid-feedback" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                      Last name is required
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                    <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                    <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                    <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                    <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                    <div *ngIf="registerForm.errors?.['passwordMismatch']">Passwords do not match</div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  [disabled]="registerForm.invalid || isLoading"
                >
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading"></span>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </form>

              <div class="text-center mt-3">
                <p class="mb-0">
                  Already have an account?
                  <a routerLink="/login" class="text-decoration-none">Sign in</a>
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
      padding: 2rem 0;
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Account created successfully! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
