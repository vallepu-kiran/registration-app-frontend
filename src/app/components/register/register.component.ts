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
    <div class="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6">
            <div class="card shadow-lg border-0 fade-in">
              <div class="card-body p-4 p-sm-5">
                <div class="text-center mb-4">
                  <div class="mb-3">
                    <div class="user-avatar mx-auto" style="width: 60px; height: 60px; font-size: 1.5rem;">
                      <i class="fas fa-user-plus"></i>
                    </div>
                  </div>
                  <h2 class="card-title h3 mb-2">Create Account</h2>
                  <p class="text-muted mb-0">Join us today</p>
                </div>

                <div class="alert alert-success" *ngIf="successMessage" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ successMessage }}
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage" role="alert">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>
                  <!-- Personal Information Section -->
                  <div class="mb-4">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-user me-2"></i>
                      Personal Information
                    </h6>
                    
                    <div class="row">
                      <div class="col-12 col-sm-6 mb-3">
                        <label for="firstName" class="form-label fw-medium">First Name *</label>
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="firstName"
                          formControlName="firstName"
                          placeholder="First name"
                          autocomplete="given-name"
                          [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                        >
                        <div class="invalid-feedback" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                          First name is required
                        </div>
                      </div>

                      <div class="col-12 col-sm-6 mb-3">
                        <label for="lastName" class="form-label fw-medium">Last Name *</label>
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="lastName"
                          formControlName="lastName"
                          placeholder="Last name"
                          autocomplete="family-name"
                          [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                        >
                        <div class="invalid-feedback" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                          Last name is required
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="email" class="form-label fw-medium">Email Address *</label>
                      <input
                        type="email"
                        class="form-control form-control-lg"
                        id="email"
                        formControlName="email"
                        placeholder="Enter your email"
                        autocomplete="email"
                        [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                        <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                        <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="phoneNumber" class="form-label fw-medium">Phone Number</label>
                      <input
                        type="tel"
                        class="form-control form-control-lg"
                        id="phoneNumber"
                        formControlName="phoneNumber"
                        placeholder="Enter your phone number"
                        autocomplete="tel"
                        [class.is-invalid]="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched">
                        <div *ngIf="registerForm.get('phoneNumber')?.errors?.['pattern']">Please enter a valid phone number (10 digits)</div>
                      </div>
                    </div>
                  </div>

                  <!-- Address Information Section -->
                  <div class="mb-4">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-map-marker-alt me-2"></i>
                      Address Information
                    </h6>
                    
                    <div class="row">
                      <div class="col-12 col-sm-6 mb-3">
                        <label for="city" class="form-label fw-medium">City</label>
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="city"
                          formControlName="city"
                          placeholder="Enter your city"
                          autocomplete="address-level2"
                        >
                      </div>

                      <div class="col-12 col-sm-6 mb-3">
                        <label for="state" class="form-label fw-medium">State</label>
                        <input
                          type="text"
                          class="form-control form-control-lg"
                          id="state"
                          formControlName="state"
                          placeholder="Enter your state"
                          autocomplete="address-level1"
                        >
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="country" class="form-label fw-medium">Country</label>
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="country"
                        formControlName="country"
                        placeholder="Enter your country"
                        autocomplete="country-name"
                      >
                    </div>
                  </div>

                  <!-- Security Section -->
                  <div class="mb-4">
                    <h6 class="text-muted mb-3">
                      <i class="fas fa-lock me-2"></i>
                      Security
                    </h6>
                    
                    <div class="mb-3">
                      <label for="password" class="form-label fw-medium">Password *</label>
                      <input
                        type="password"
                        class="form-control form-control-lg"
                        id="password"
                        formControlName="password"
                        placeholder="Create a password"
                        autocomplete="new-password"
                        [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                        <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                        <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label for="confirmPassword" class="form-label fw-medium">Confirm Password *</label>
                      <input
                        type="password"
                        class="form-control form-control-lg"
                        id="confirmPassword"
                        formControlName="confirmPassword"
                        placeholder="Confirm your password"
                        autocomplete="new-password"
                        [class.is-invalid]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                        <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                        <div *ngIf="registerForm.errors?.['passwordMismatch']">Passwords do not match</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 mb-3"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </form>

                <div class="text-center">
                  <p class="mb-0 text-muted">
                    Already have an account?
                    <a routerLink="/login" class="text-decoration-none fw-medium ms-1">Sign in</a>
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
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .form-control-lg {
      padding: 0.75rem 1rem;
      font-size: 1rem;
    }
    
    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
    }
    
    .section-divider {
      border-top: 1px solid #dee2e6;
      margin: 1.5rem 0;
    }
    
    h6 {
      color: #6c757d;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
    }
    
    @media (max-width: 575.98px) {
      .card-body {
        padding: 2rem 1.5rem !important;
      }
      
      .h3 {
        font-size: 1.5rem;
      }
      
      .card {
        max-height: 95vh;
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
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      city: [''],
      state: [''],
      country: [''],
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
      
      // Remove empty optional fields
      Object.keys(userData).forEach(key => {
        if (userData[key] === '' || userData[key] === null) {
          delete userData[key];
        }
      });

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
