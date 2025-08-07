import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
            <div>
              <h1 class="h3 mb-1">Dashboard</h1>
              <p class="text-muted mb-0">Welcome back, {{ currentUser?.firstName }}!</p>
            </div>
            <div class="mt-2 mt-sm-0">
              <span class="badge bg-success fs-6">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 g-md-4 mb-4">
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card bg-primary text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="card-title mb-1">Active</h4>
                  <p class="card-text mb-0 opacity-75">Account Status</p>
                </div>
                <div class="opacity-75">
                  <i class="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card bg-success text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="card-title mb-1">Secure</h4>
                  <p class="card-text mb-0 opacity-75">Data Protection</p>
                </div>
                <div class="opacity-75">
                  <i class="fas fa-shield-alt fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card bg-info text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h4 class="card-title mb-1">{{ getCurrentDate() }}</h4>
                  <p class="card-text mb-0 opacity-75">Today's Date</p>
                </div>
                <div class="opacity-75">
                  <i class="fas fa-calendar fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 g-md-4">
        <div class="col-12 col-lg-8">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">
                <i class="fas fa-bolt me-2 text-primary"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <a routerLink="/profile" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-3">
                    <i class="fas fa-user me-2"></i>
                    Update Profile
                  </a>
                </div>
                <div class="col-12 col-sm-6">
                  <button class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-3" disabled>
                    <i class="fas fa-cog me-2"></i>
                    Settings
                  </button>
                </div>
              </div>
              
              <div class="row g-3 mt-2">
                <div class="col-12">
                  <div class="alert alert-info mb-0">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Welcome to your dashboard!</strong> 
                    You can manage your profile and account settings from here.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div class="card h-100">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">
                <i class="fas fa-user-circle me-2 text-primary"></i>
                Profile Summary
              </h5>
            </div>
            <div class="card-body text-center" *ngIf="currentUser">
              <div class="mb-3">
                <div class="user-avatar mx-auto mb-3" style="width: 60px; height: 60px; font-size: 1.5rem;">
                  {{ getUserInitials() }}
                </div>
                <h6 class="mb-1">{{ currentUser.firstName }} {{ currentUser.lastName }}</h6>
                <small class="text-muted">{{ currentUser.email }}</small>
                
                <div class="mt-3 text-start">
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
              <div class="d-grid">
                <a routerLink="/profile" class="btn btn-primary">
                  <i class="fas fa-edit me-2"></i>
                  Edit Profile
                </a>
              </div>
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
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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
    
    .btn {
      transition: all 0.2s ease-in-out;
    }
    
    .btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .badge {
      padding: 0.5rem 0.75rem;
    }
    
    @media (max-width: 575.98px) {
      .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .card-body {
        padding: 1rem;
      }
      
      .h3 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
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
