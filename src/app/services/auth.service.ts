// src/app/services/auth.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);

  // Computed values (readonly)
  user = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());
  isLoading = computed(() => this.loadingSignal());

  constructor(private router: Router) {
    // Load from localStorage on init
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem('syncboard_token');
    const user = localStorage.getItem('syncboard_user');
    
    if (token && user) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(user));
    }
  }

  private saveAuth(response: AuthResponse): void {
    localStorage.setItem('syncboard_token', response.token);
    localStorage.setItem('syncboard_user', JSON.stringify(response.user));
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);
  }

  private clearAuth(): void {
    localStorage.removeItem('syncboard_token');
    localStorage.removeItem('syncboard_user');
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await this.mockLoginApi(credentials);
      this.saveAuth(response);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async register(credentials: RegisterCredentials): Promise<void> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await this.mockRegisterApi(credentials);
      this.saveAuth(response);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  // Mock API methods (replace with real HTTP calls)
  private mockLoginApi(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'demo@syncboard.com' && credentials.password === 'demo123') {
          resolve({
            user: {
              id: '1',
              email: credentials.email,
              name: 'Demo User',
              createdAt: new Date()
            },
            token: 'mock-jwt-token-12345'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  private mockRegisterApi(credentials: RegisterCredentials): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Math.random().toString(),
            email: credentials.email,
            name: credentials.sirName,
            createdAt: new Date()
          },
          token: 'mock-jwt-token-' + Date.now()
        });
      }, 1000);
    });
  }
}
