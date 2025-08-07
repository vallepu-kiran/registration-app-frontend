import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, ApiResponse, ChangePasswordRequest, UpdateProfileRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/users/profile`).pipe(
      map(response => {
        // Handle both direct user response and wrapped response
        if (response.user) {
          return response.user;
        } else if (response.data) {
          return response.data;
        } else {
          // If response is directly a user object
          return response as any as User;
        }
      })
    );
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
