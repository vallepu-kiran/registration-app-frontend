import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <h1 class="h3 mb-4">
            <i class="fas fa-user-cog me-2 text-primary"></i>
            Profile Settings
          </h1>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-xl-8">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">
                <i class="fas fa-user me-2 text-primary"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-success" *ngIf="successMessage">
                <i class="fas fa-check-circle me-2"></i>
                {{ successMessage }}
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <!-- Basic Information -->
                <div class="mb-4">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-id-card me-2"></i>
                    Basic Information
                  </h6>
                  
                  <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                      <label for="firstName" class="form-label fw-medium">First Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="firstName"
                        formControlName="firstName"
                        [class.is-invalid]="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                        First name is required
                      </div>
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                      <label for="lastName" class="form-label fw-medium">Last Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="lastName"
                        formControlName="lastName"
                        [class.is-invalid]="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                        Last name is required
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                      <label for="email" class="form-label fw-medium">Email Address</label>
                      <input
                        type="email"
                        class="form-control"
                        id="email"
                        formControlName="email"
                        readonly
                      >
                      <small class="form-text text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        Email cannot be changed
                      </small>
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                      <label for="phoneNumber" class="form-label fw-medium">Phone Number</label>
                      <input
                        type="tel"
                        class="form-control"
                        id="phoneNumber"
                        formControlName="phoneNumber"
                        placeholder="Enter phone number"
                        [class.is-invalid]="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="profileForm.get('phoneNumber')?.invalid && profileForm.get('phoneNumber')?.touched">
                        Please enter a valid phone number (10 digits)
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Address Information -->
                <div class="mb-4">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    Address Information
                  </h6>
                  
                  <div class="row">
                    <div class="col-12 col-md-6 mb-3">
                      <label for="city" class="form-label fw-medium">City</label>
                      <input
                        type="text"
                        class="form-control"
                        id="city"
                        formControlName="city"
                        placeholder="Enter your city"
                      >
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                      <label for="state" class="form-label fw-medium">State</label>
                      <input
                        type="text"
                        class="form-control"
                        id="state"
                        formControlName="state"
                        placeholder="Enter your state"
                      >
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="country" class="form-label fw-medium">Country</label>
                    <input
                      type="text"
                      class="form-control"
                      id="country"
                      formControlName="country"
                      placeholder="Enter your country"
                    >
                  </div>
                </div>

                <div class="d-flex flex-column flex-sm-row gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="profileForm.invalid || isUpdating"
                  >
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isUpdating"></span>
                    <i class="fas fa-save me-2" *ngIf="!isUpdating"></i>
                    {{ isUpdating ? 'Updating...' : 'Update Profile' }}
                  </button>
                  
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="loadProfile()"
                    [disabled]="isUpdating"
                  >
                    <i class="fas fa-undo me-2"></i>
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-4">
          <!-- Change Password Card -->
          <div class="card mb-4">
            <div class="card-header bg-warning text-dark">
              <h5 class="card-title mb-0">
                <i class="fas fa-key me-2"></i>
                Change Password
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-success" *ngIf="passwordSuccessMessage">
                <i class="fas fa-check-circle me-2"></i>
                {{ passwordSuccessMessage }}
              </div>

              <div class="alert alert-danger" *ngIf="passwordErrorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ passwordErrorMessage }}
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <div class="mb-3">
                  <label for="oldPassword" class="form-label fw-medium">Current Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="oldPassword"
                    formControlName="oldPassword"
                    [class.is-invalid]="passwordForm.get('oldPassword')?.invalid && passwordForm.get('oldPassword')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="passwordForm.get('oldPassword')?.invalid && passwordForm.get('oldPassword')?.touched">
                    Current password is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="newPassword" class="form-label fw-medium">New Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    formControlName="newPassword"
                    [class.is-invalid]="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
                    <div *ngIf="passwordForm.get('newPassword')?.errors?.['required']">New password is required</div>
                    <div *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">Password must be at least 6 characters</div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-warning w-100"
                  [disabled]="passwordForm.invalid || isChangingPassword"
                >
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="isChangingPassword"></span>
                  <i class="fas fa-key me-2" *ngIf="!isChangingPassword"></i>
                  {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Profile Summary Card -->
          <div class="card mb-4" *ngIf="currentUser">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-user-circle me-2"></i>
                Profile Summary
              </h5>
            </div>
            <div class="card-body text-center">
              <div class="user-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                {{ getUserInitials() }}
              </div>
              <h6 class="mb-1">{{ currentUser.firstName }} {{ currentUser.lastName }}</h6>
              <p class="text-muted mb-2">{{ currentUser.email }}</p>
              
              <div class="text-start mt-3">
                <small class="text-muted d-block" *ngIf="currentUser.phoneNumber">
                  <i class="fas fa-phone me-2"></i>{{ currentUser.phoneNumber }}
                </small>
                <small class="text-muted d-block" *ngIf="currentUser.city || currentUser.state">
                  <i class="fas fa-map-marker-alt me-2"></i>
                  {{ getLocationString() }}
                </small>
                <small class="text-muted d-block" *ngIf="currentUser.country">
                  <i class="fas fa-globe me-2"></i>{{ currentUser.country }}
                </small>
              </div>
            </div>
          </div>

          <!-- Danger Zone Card -->
          <div class="card">
            <div class="card-header bg-danger text-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Danger Zone
              </h5>
            </div>
            <div class="card-body">
              <p class="text-muted mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                class="btn btn-danger w-100"
                (click)="deleteAccount()"
                [disabled]="isDeleting"
              >
                <span class="spinner-border spinner-border-sm me-2" *ngIf="isDeleting"></span>
                <i class="fas fa-trash me-2" *ngIf="!isDeleting"></i>
                {{ isDeleting ? 'Deleting...' : 'Delete Account' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border-radius: 12px;
    }
    
    .card-header {
      border-bottom: 1px solid #dee2e6;
      border-radius: 12px 12px 0 0 !important;
      padding: 1rem 1.25rem;
    }
    
    .user-avatar {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }
    
    h6 {
      color: #6c757d;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
    }
    
    @media (max-width: 575.98px) {
      .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .card-body {
        padding: 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  
  isUpdating = false;
  isChangingPassword = false;
  isDeleting = false;
  
  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      city: [''],
      state: [''],
      country: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  console.log('ProfileComponent ngOnInit started');
  
  // First, get current user from auth service and populate form
  this.authService.currentUser$.subscribe(user => {
    console.log('Current user from auth service:', user);
    this.currentUser = user;
    if (user) {
      console.log('Populating form with user data:', user);
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || ''
      });
      console.log('Form values after patch:', this.profileForm.value);
    }
  });

  // Then load fresh profile data from API
  this.loadProfile();
}

  loadProfile() {
  console.log('Loading profile from API...');
  this.userService.getProfile().subscribe({
    next: (user) => {
      console.log('Profile data received from API:', user);
      // Update current user in auth service
      this.currentUser = user;
      this.authService.updateCurrentUser(user);
      
      // Populate form with all user data
      this.profileForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || ''
      });
      
      console.log('Form values after API load:', this.profileForm.value);
      
      // Clear any previous messages
      this.successMessage = '';
      this.errorMessage = '';
    },
    error: (error) => {
      console.error('Profile load error:', error);
      this.errorMessage = 'Failed to load profile data';
      
      // If API fails, try to use current user from auth service
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        console.log('Using fallback user data from auth service:', currentUser);
        this.currentUser = currentUser;
        this.profileForm.patchValue({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phoneNumber: currentUser.phoneNumber || '',
          city: currentUser.city || '',
          state: currentUser.state || '',
          country: currentUser.country || ''
        });
      }
    }
  });
}

  updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { email, ...updateData } = this.profileForm.value;
      
      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

    this.userService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isUpdating = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Refresh the profile data to get the latest information
        this.loadProfile();
        
        // Also refresh the auth service user data
        this.authService.verifyToken().subscribe();
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.error?.message || 'Failed to update profile';
      }
    });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.passwordSuccessMessage = '';
      this.passwordErrorMessage = '';

      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: (response) => {
          this.isChangingPassword = false;
          this.passwordSuccessMessage = 'Password changed successfully!';
          this.passwordForm.reset();
        },
        error: (error) => {
          this.isChangingPassword = false;
          this.passwordErrorMessage = error.error?.message || 'Failed to change password';
        }
      });
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.isDeleting = true;

      this.userService.deleteAccount().subscribe({
        next: (response) => {
          this.isDeleting = false;
          alert('Account deleted successfully');
          this.authService.logout().subscribe();
        },
        error: (error) => {
          this.isDeleting = false;
          alert('Failed to delete account: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }

  getLocationString(): string {
    if (this.currentUser) {
      const parts = [];
      if (this.currentUser.city) parts.push(this.currentUser.city);
      if (this.currentUser.state) parts.push(this.currentUser.state);
      return parts.join(', ');
    }
    return '';
  }
}
