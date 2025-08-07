import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse, ChangePasswordRequest, UpdateProfileRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/profile`);
  }

  updateProfile(userData: UpdateProfileRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/users/profile`, userData);
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/users/change-password`, passwordData);
  }

  deleteAccount(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/users/account`);
  }
}
