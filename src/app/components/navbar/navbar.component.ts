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
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-user-circle me-2"></i>
          Registration App
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/users" routerLinkActive="active">
                <i class="fas fa-users me-1"></i>
                Users
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                <div class="user-avatar d-inline-flex me-2">
                  {{ getUserInitials() }}
                </div>
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </a>
              <ul class="dropdown-menu">
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
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }
    
    .dropdown-toggle::after {
      margin-left: 0.5rem;
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
