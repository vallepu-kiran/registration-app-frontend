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
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="h3 mb-4">Profile Settings</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-success" *ngIf="successMessage">
                {{ successMessage }}
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
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

                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
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

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    readonly
                  >
                  <small class="form-text text-muted">Email cannot be changed</small>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="profileForm.invalid || isUpdating"
                >
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="isUpdating"></span>
                  {{ isUpdating ? 'Updating...' : 'Update Profile' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Change Password</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-success" *ngIf="passwordSuccessMessage">
                {{ passwordSuccessMessage }}
              </div>

              <div class="alert alert-danger" *ngIf="passwordErrorMessage">
                {{ passwordErrorMessage }}
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <div class="mb-3">
                  <label for="oldPassword" class="form-label">Current Password</label>
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
                  <label for="newPassword" class="form-label">New Password</label>
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
                  {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </form>
            </div>
          </div>

          <div class="card mt-4">
            <div class="card-header bg-danger text-white">
              <h5 class="card-title mb-0">Danger Zone</h5>
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
      border-radius: 10px;
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      border-radius: 10px 10px 0 0 !important;
    }
    
    .card-header.bg-danger {
      background-color: #dc3545 !important;
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
      email: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });

    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile data';
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { email, ...updateData } = this.profileForm.value;

      this.userService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.isUpdating = false;
          this.successMessage = 'Profile updated successfully!';
          // Update current user in auth service
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
}
