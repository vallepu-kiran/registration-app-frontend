import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">Dashboard</h1>
            <div class="text-muted">
              Welcome back, {{ currentUser?.firstName }}!
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ totalUsers }}</h4>
                  <p class="card-text">Total Users</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-users fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">Active</h4>
                  <p class="card-text">Account Status</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-check-circle fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="card-title">{{ getCurrentDate() }}</h4>
                  <p class="card-text">Today's Date</p>
                </div>
                <div class="align-self-center">
                  <i class="fas fa-calendar fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <a href="/profile" class="btn btn-outline-primary w-100">
                    <i class="fas fa-user me-2"></i>
                    Update Profile
                  </a>
                </div>
                <div class="col-md-6 mb-3">
                  <a href="/users" class="btn btn-outline-secondary w-100">
                    <i class="fas fa-users me-2"></i>
                    View All Users
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Profile Summary</h5>
            </div>
            <div class="card-body" *ngIf="currentUser">
              <div class="text-center mb-3">
                <div class="user-avatar mx-auto mb-2" style="width: 60px; height: 60px; font-size: 1.5rem;">
                  {{ getUserInitials() }}
                </div>
                <h6 class="mb-1">{{ currentUser.firstName }} {{ currentUser.lastName }}</h6>
                <small class="text-muted">{{ currentUser.email }}</small>
              </div>
              <div class="d-grid">
                <a href="/profile" class="btn btn-sm btn-primary">
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
      border-radius: 10px;
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      border-radius: 10px 10px 0 0 !important;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    .user-avatar {
      background-color: #007bff;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalUsers = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadTotalUsers();
  }

  loadTotalUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
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
}
