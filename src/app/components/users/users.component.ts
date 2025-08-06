import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 mb-0">All Users</h1>
            <button class="btn btn-primary" (click)="loadUsers()">
              <i class="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="fas fa-users me-2"></i>
                Registered Users ({{ users.length }})
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info" *ngIf="isLoading">
                <i class="fas fa-spinner fa-spin me-2"></i>
                Loading users...
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                {{ errorMessage }}
              </div>

              <div class="table-responsive" *ngIf="!isLoading && users.length > 0">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Avatar</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users; let i = index">
                      <th scope="row">{{ i + 1 }}</th>
                      <td>
                        <div class="user-avatar">
                          {{ getUserInitials(user) }}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                        </div>
                      </td>
                      <td>
                        <span class="text-muted">{{ user.email }}</span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary" (click)="viewUser(user)">
                          <i class="fas fa-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="text-center py-5" *ngIf="!isLoading && users.length === 0 && !errorMessage">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No users found</h5>
                <p class="text-muted">There are no registered users at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Details Modal -->
      <div class="modal fade" id="userModal" tabindex="-1" *ngIf="selectedUser">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">User Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <div class="user-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                  {{ getUserInitials(selectedUser) }}
                </div>
                <h4>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h4>
                <p class="text-muted">{{ selectedUser.email }}</p>
              </div>
              
              <div class="row">
                <div class="col-sm-4"><strong>User ID:</strong></div>
                <div class="col-sm-8">{{ selectedUser.id }}</div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-4"><strong>First Name:</strong></div>
                <div class="col-sm-8">{{ selectedUser.firstName }}</div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-4"><strong>Last Name:</strong></div>
                <div class="col-sm-8">{{ selectedUser.lastName }}</div>
              </div>
              <hr>
              <div class="row">
                <div class="col-sm-4"><strong>Email:</strong></div>
                <div class="col-sm-8">{{ selectedUser.email }}</div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
    
    .user-avatar {
      width: 40px;
      height: 40px;
      background-color: #007bff;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }
    
    .table th {
      border-top: none;
      font-weight: 600;
    }
    
    .table-hover tbody tr:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
    
    .modal-content {
      border-radius: 10px;
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load users';
      }
    });
  }

  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  viewUser(user: User) {
    this.selectedUser = user;
    // In a real app, you'd use a proper modal library like ng-bootstrap
    // For now, we'll just show an alert with user details
    alert(`User Details:\n\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nID: ${user.id}`);
  }
}
