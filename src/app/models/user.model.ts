export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  message: string;
  user?: T;
  data?: T;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  country?: string;
}
