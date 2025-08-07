import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
            <div>
              <h1 class="h3 mb-1">
                <i class="fas fa-users me-2 text-primary"></i>
                All Users
              </h1>
              <p class="text-muted mb-0">Manage registered users</p>
            </div>
            <div class="mt-2 mt-sm-0">
              <button class="btn btn-primary" (click)="loadUsers()">
                <i class="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">
                <i class="fas fa-table me-2 text-primary"></i>
                Registered Users ({{ users.length }})
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info" *ngIf="isLoading">
                <i class="fas fa-spinner fa-spin me-2"></i>
                Loading users...
              </div>

              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ errorMessage }}
              </div>

              <div class="table-responsive" *ngIf="!isLoading && users.length > 0">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th scope="col" class="text-center">#</th>
                      <th scope="col">User</th>
                      <th scope="col" class="d-none d-md-table-cell">Contact</th>
                      <th scope="col" class="d-none d-lg-table-cell">Location</th>
                      <th scope="col" class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users; let i = index" class="user-row">
                      <th scope="row" class="text-center">{{ i + 1 }}</th>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="user-avatar me-3">
                            {{ getUserInitials(user) }}
                          </div>
                          <div>
                            <div class="fw-bold">{{ user.firstName }} {{ user.lastName }}</div>
                            <small class="text-muted">{{ user.email }}</small>
                            <div class="d-md-none mt-1" *ngIf="user.phoneNumber">
                              <small class="text-muted">
                                <i class="fas fa-phone me-1"></i>{{ user.phoneNumber }}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="d-none d-md-table-cell">
                        <div *ngIf="user.phoneNumber; else noPhone">
                          <i class="fas fa-phone me-2 text-muted"></i>
                          {{ user.phoneNumber }}
                        </div>
                        <ng-template #noPhone>
                          <span class="text-muted">-</span>
                        </ng-template>
                      </td>
                      <td class="d-none d-lg-table-cell">
                        <div *ngIf="getLocationString(user); else noLocation">
                          <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                          {{ getLocationString(user) }}
                        </div>
                        <ng-template #noLocation>
                          <span class="text-muted">-</span>
                        </ng-template>
                      </td>
                      <td class="text-center">
                        <button 
                          class="btn btn-sm btn-outline-primary" 
                          (click)="viewUser(user)"
                          [attr.aria-label]="'View details for ' + user.firstName + ' ' + user.lastName"
                        >
                          <i class="fas fa-eye me-1"></i>
                          <span class="d-none d-sm-inline">View</span>
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
      <div class="modal fade" id="userModal" tabindex="-1" *ngIf="selectedUser" aria-labelledby="userModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="userModalLabel">
                <i class="fas fa-user me-2"></i>
                User Details
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12 col-md-4 text-center mb-4 mb-md-0">
                  <div class="user-avatar mx-auto mb-3" style="width: 100px; height: 100px; font-size: 2.5rem;">
                    {{ getUserInitials(selectedUser) }}
                  </div>
                  <h4>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h4>
                  <p class="text-muted">ID: {{ selectedUser.id }}</p>
                </div>
                
                <div class="col-12 col-md-8">
                  <div class="row g-3">
                    <div class="col-12">
                      <h6 class="text-muted mb-2">
                        <i class="fas fa-envelope me-2"></i>
                        Contact Information
                      </h6>
                      <div class="bg-light p-3 rounded">
                        <div class="mb-2">
                          <strong>Email:</strong> {{ selectedUser.email }}
                        </div>
                        <div *ngIf="selectedUser.phoneNumber">
                          <strong>Phone:</strong> {{ selectedUser.phoneNumber }}
                        </div>
                        <div *ngIf="!selectedUser.phoneNumber" class="text-muted">
                          <em>No phone number provided</em>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-12" *ngIf="selectedUser.city || selectedUser.state || selectedUser.country">
                      <h6 class="text-muted mb-2">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        Address Information
                      </h6>
                      <div class="bg-light p-3 rounded">
                        <div *ngIf="selectedUser.city" class="mb-2">
                          <strong>City:</strong> {{ selectedUser.city }}
                        </div>
                        <div *ngIf="selectedUser.state" class="mb-2">
                          <strong>State:</strong> {{ selectedUser.state }}
                        </div>
                        <div *ngIf="selectedUser.country">
                          <strong>Country:</strong> {{ selectedUser.country }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-12" *ngIf="!selectedUser.city && !selectedUser.state && !selectedUser.country">
                      <h6 class="text-muted mb-2">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        Address Information
                      </h6>
                      <div class="bg-light p-3 rounded text-muted">
                        <em>No address information provided</em>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                <i class="fas fa-times me-2"></i>
                Close
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
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      border-radius: 12px 12px 0 0 !important;
    }
    
    .user-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.1rem;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    }
    
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
    }
    
    .user-row {
      transition: all 0.2s ease-in-out;
    }
    
    .user-row:hover {
      background-color: rgba(0, 123, 255, 0.05);
      transform: translateY(-1px);
    }
    
    .modal-content {
      border-radius: 12px;
      border: none;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    }
    
    .modal-header {
      border-radius: 12px 12px 0 0;
    }
    
    .btn {
      transition: all 0.2s ease-in-out;
    }
    
    .btn:hover {
      transform: translateY(-1px);
    }
    
    @media (max-width: 575.98px) {
      .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .card-body {
        padding: 1rem;
      }
      
      .user-avatar {
        width: 40px;
        height: 40px;
        font-size: 0.9rem;
      }
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

  getLocationString(user: User): string {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    if (user.country && parts.length === 0) parts.push(user.country);
    return parts.join(', ') || (user.country || '');
  }

  viewUser(user: User) {
    this.selectedUser = user;
    // Create a more detailed modal display
    const modalHtml = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">User Details</h5>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="user-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${this.getUserInitials(user)}
              </div>
              <h4>${user.firstName} ${user.lastName}</h4>
              <p class="text-muted">ID: ${user.id}</p>
            </div>
            
            <div class="row">
              <div class="col-sm-4"><strong>Email:</strong></div>
              <div class="col-sm-8">${user.email}</div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-4"><strong>Phone:</strong></div>
              <div class="col-sm-8">${user.phoneNumber || 'Not provided'}</div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-4"><strong>City:</strong></div>
              <div class="col-sm-8">${user.city || 'Not provided'}</div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-4"><strong>State:</strong></div>
              <div class="col-sm-8">${user.state || 'Not provided'}</div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-4"><strong>Country:</strong></div>
              <div class="col-sm-8">${user.country || 'Not provided'}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // For now, use alert with formatted text
    const userDetails = `
User Details:

Name: ${user.firstName} ${user.lastName}
Email: ${user.email}
Phone: ${user.phoneNumber || 'Not provided'}
City: ${user.city || 'Not provided'}
State: ${user.state || 'Not provided'}
Country: ${user.country || 'Not provided'}
ID: ${user.id}
    `;
    
    alert(userDetails);
  }
}
