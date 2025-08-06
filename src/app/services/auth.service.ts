import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, LoginResponse, ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(userData: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.API_URL}/auth/register`, userData);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        })
      );
  }

  verifyToken(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/auth/verify`)
      .pipe(
        tap(response => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.verifyToken().subscribe({
        next: () => {
          // Token is valid, user data updated in tap operator
        },
        error: () => {
          this.clearAuthData();
        }
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
