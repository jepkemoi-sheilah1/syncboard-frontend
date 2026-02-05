// src/app/services/auth.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, VerifyOTPRequest, ResendOTPRequest, RegisterResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private pendingEmailSignal = signal<string | null>(null); // For OTP verification flow

  // Computed values (readonly)
  user = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());
  isLoading = computed(() => this.loadingSignal());
  pendingEmail = computed(() => this.pendingEmailSignal());

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

  /**
   * Step 1: Register - initiates registration and sends OTP to email
   * Returns RegisterResponse with requiresVerification: true
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await this.mockRegisterApi(credentials);
      
      // Store pending email for OTP verification
      this.pendingEmailSignal.set(credentials.email);
      
      return response;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Step 2: Verify OTP - validates the 6-digit OTP sent to email
   * On success, completes registration but does NOT auto-login user
   * User must manually sign in after registration
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<AuthResponse> {
    this.loadingSignal.set(true);

    try {
      // TODO: Replace with actual API call
      const response = await this.mockVerifyOTPApi(request);

      // Clear pending email after successful verification
      this.pendingEmailSignal.set(null);

      // DO NOT save auth to localStorage - user must sign in manually
      // this.saveAuth(response);

      return response;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Resend OTP to the same email address
   */
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    this.loadingSignal.set(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update pending email if needed
      this.pendingEmailSignal.set(email);
      
      return {
        success: true,
        message: 'OTP sent successfully'
      };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Cancel registration and clear pending state
   */
  cancelRegistration(): void {
    this.pendingEmailSignal.set(null);
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

  private mockRegisterApi(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate OTP sent to email
        console.log(`OTP would be sent to: ${credentials.email}`);
        
        resolve({
          success: true,
          message: 'Registration initiated. Please verify OTP sent to your email.',
          requiresVerification: true,
          email: credentials.email
        });
      }, 1000);
    });
  }

  private mockVerifyOTPApi(request: VerifyOTPRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate OTP validation (accept '123456' as valid OTP)
        if (request.otp === '123456') {
          // Get stored registration data from localStorage
          const pendingReg = JSON.parse(localStorage.getItem('pending_registration') || '{}');
          
          // Create user object from registration data
          const user: User = {
            id: Date.now().toString(),
            email: request.email,
            name: pendingReg.firstName && pendingReg.sirName 
              ? `${pendingReg.firstName} ${pendingReg.sirName}` 
              : 'New User',
            createdAt: new Date()
          };
          
          resolve({
            user: user,
            token: 'mock-jwt-token-' + Date.now()
          });
        } else {
          reject(new Error('Invalid OTP. Use 123456 for testing.'));
        }
      }, 1000);
    });
  }
}
