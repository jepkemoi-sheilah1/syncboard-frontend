// src/app/services/auth.service.ts
// Simple authentication service

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSignal = signal<User | null>(null);
    private tokenSignal = signal<string | null>(null);
    private loadingSignal = signal<boolean>(false);

    user = computed(() => this.currentUserSignal());
    isLoggedIn = computed(() => !!this.tokenSignal());
    isLoading = computed(() => this.loadingSignal());

    constructor(private router: Router) {
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

    async login(credentials: LoginCredentials): Promise<void> {
        this.loadingSignal.set(true);
        try {
            const response = await this.mockLoginApi(credentials);
            this.saveAuth(response);
        } finally {
            this.loadingSignal.set(false);
        }
    }

    private mockLoginApi(credentials: LoginCredentials): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.email === 'demo@syncboard.com' && credentials.password === 'demo123') {
                    resolve({
                        user: { id: '1', email: credentials.email, name: 'Demo User', createdAt: new Date() },
                        token: 'mock-jwt-token-12345'
                    });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    async register(credentials: RegisterCredentials): Promise<void> {
        this.loadingSignal.set(true);
        try {
            await this.mockRegisterApi(credentials);
        } finally {
            this.loadingSignal.set(false);
        }
    }

    private mockRegisterApi(credentials: RegisterCredentials): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('registration_complete', 'true');
                resolve();
            }, 1000);
        });
    }

    logout(): void {
        localStorage.removeItem('syncboard_token');
        localStorage.removeItem('syncboard_user');
        localStorage.removeItem('registration_complete');
        this.tokenSignal.set(null);
        this.currentUserSignal.set(null);
        this.router.navigate(['/login']);
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn();
    }
}

