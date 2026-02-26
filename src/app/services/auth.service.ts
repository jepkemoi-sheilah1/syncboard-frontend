// src/app/services/auth.service.ts
// Simple authentication service

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterCredentials, AuthResponse, DeleteAccountResponse } from '../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSignal = signal<User | null>(null);
    private tokenSignal = signal<string | null>(null);
    private loadingSignal = signal<boolean>(false);

    user = computed(() => this.currentUserSignal());
    isLoggedIn = computed(() => !!this.tokenSignal());
    isLoading = computed(() => this.loadingSignal());

    constructor(private router: Router, private http: HttpClient) {
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
        // Compute name from firstName and sirName
        const userWithName = {
            ...response.user,
            name: `${response.user.firstName} ${response.user.sirName}`.trim()
        };
        localStorage.setItem('syncboard_token', response.token);
        localStorage.setItem('syncboard_user', JSON.stringify(userWithName));
        this.tokenSignal.set(response.token);
        this.currentUserSignal.set(userWithName);
    }

    async login(credentials: LoginCredentials): Promise<void> {
        this.loadingSignal.set(true);
        try {
            const response = await this.http.post<AuthResponse>(
                `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.login}`,
                credentials
            ).toPromise();
            if (response) {
                this.saveAuth(response);
            } else {
                throw new Error('Login failed: No response from server');
            }
        } catch (error) {
            throw error;
        } finally {
            this.loadingSignal.set(false);
        }
    }

    async register(credentials: RegisterCredentials): Promise<void> {
        this.loadingSignal.set(true);
        try {
            await this.http.post(
                `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.register}`,
                credentials
            ).toPromise();
        } catch (error) {
            throw error;
        } finally {
            this.loadingSignal.set(false);
        }
    }

   

    logout(): void {
        localStorage.removeItem('syncboard_token');
        localStorage.removeItem('syncboard_user');
        localStorage.removeItem('registration_complete');
        localStorage.removeItem('email_verified');
        localStorage.removeItem('verification_error');
        this.tokenSignal.set(null);
        this.currentUserSignal.set(null);
        this.router.navigate(['/login']);
    }

    // Email Verification Methods
    verifyEmail(token: string): Promise<boolean> {
        return this.http.post<{ success: boolean }>(
            `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.verifyEmail}`,
            { token }
        ).toPromise().then(response => {
            if (response?.success) {
                localStorage.setItem('email_verified', 'true');
                localStorage.removeItem('verification_error');
                return true;
            } else {
                localStorage.setItem('verification_error', 'Verification failed');
                return false;
            }
        }).catch(() => {
            localStorage.setItem('verification_error', 'Network error during verification');
            return false;
        });
    }


    isEmailVerified(): boolean {
        return localStorage.getItem('email_verified') === 'true';
    }

    clearVerificationStatus(): void {
        localStorage.removeItem('email_verified');
        localStorage.removeItem('verification_error');
    }

    getVerificationError(): string | null {
        return localStorage.getItem('verification_error');
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn();
    }

    async forgotPassword(email: string): Promise<void> {
        this.loadingSignal.set(true);
        try {
            await this.http.post(
                `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.forgotPassword}`,
                { email }
            ).toPromise();
        } catch (error) {
            throw error;
        } finally {
            this.loadingSignal.set(false);
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        this.loadingSignal.set(true);
        try {
            await this.http.post(
                `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.resetPassword}`,
                { token, newPassword }
            ).toPromise();
        } catch (error) {
            throw error;
        } finally {
            this.loadingSignal.set(false);
        }
    }

    async deleteAccount(password: string): Promise<DeleteAccountResponse> {
        this.loadingSignal.set(true);
        try {
            const response = await this.http.post<DeleteAccountResponse>(
                `${environment.apiUrl}${environment.api.basePath}${environment.api.endpoints.auth.deleteAccount}`,
                { password }
            ).toPromise();
            
            if (response?.success) {
                // Clear all stored auth data
                this.clearAllAuthData();
                this.router.navigate(['/login']);
            }
            
            return response || { success: false, message: 'Failed to delete account' };
        } catch (error) {
            throw error;
        } finally {
            this.loadingSignal.set(false);
        }
    }

    private clearAllAuthData(): void {
        localStorage.removeItem('syncboard_token');
        localStorage.removeItem('syncboard_user');
        localStorage.removeItem('registration_complete');
        localStorage.removeItem('email_verified');
        localStorage.removeItem('verification_error');
        this.tokenSignal.set(null);
        this.currentUserSignal.set(null);
    }
}

