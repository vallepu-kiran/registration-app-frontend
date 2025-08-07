import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" routerLink="/dashboard">
          <i class="fas fa-user-circle me-2"></i>
          <span class="d-none d-sm-inline">Registration App</span>
          <span class="d-sm-none">RegApp</span>
        </a>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt me-1"></i>
                <span class="d-lg-inline d-none">Dashboard</span>
                <span class="d-lg-none">Home</span>
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="user-avatar d-inline-flex me-2">
                  {{ getUserInitials() }}
                </div>
                <span class="d-none d-md-inline">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
                <span class="d-md-none">{{ currentUser.firstName }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" routerLink="/profile">
                    <i class="fas fa-user me-2"></i>
                    Profile
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" (click)="logout($event)">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: 600;
      font-size: 1.25rem;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .dropdown-toggle::after {
      margin-left: 0.5rem;
    }
    
    .nav-link {
      transition: all 0.2s ease-in-out;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
    }
    
    @media (max-width: 991.98px) {
      .navbar-nav {
        padding-top: 0.5rem;
      }
      
      .nav-item {
        margin-bottom: 0.25rem;
      }
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      border-radius: 8px;
    }
    
    .dropdown-item {
      transition: all 0.2s ease-in-out;
    }
    
    .dropdown-item:hover {
      background-color: #f8f9fa;
      transform: translateX(2px);
    }
  `]
})
export class NavbarComponent implements OnInit {
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

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout().subscribe({
      next: () => {
        // Logout handled in service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        this.authService.logout();
      }
    });
  }
}
