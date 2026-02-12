// src/app/components/auth/login/login.ts
// Simple login component

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = signal(false);
    error = signal('');
    successMessage = signal('');

    isLoggedIn = computed(() => this.authService.isLoggedIn());
    userName = computed(() => {
        const user = this.authService.user();
        return user?.name || user?.email?.split('@')[0] || 'User';
    });

    ngOnInit(): void {
        const registrationComplete = localStorage.getItem('registration_complete');
        const emailVerified = this.authService.isEmailVerified();
        const verificationError = this.authService.getVerificationError();
        
        if (registrationComplete) {
            localStorage.removeItem('registration_complete');
            this.successMessage.set('Account created successfully! Please sign in.');
        } else if (emailVerified) {
            this.authService.clearVerificationStatus();
            this.successMessage.set('Email verified successfully! Please sign in.');
        } else if (verificationError) {
            this.error.set(verificationError);
            this.authService.clearVerificationStatus();
        }
    }

    async onSubmit() {
        if (this.loginForm.invalid) {
            Object.values(this.loginForm.controls).forEach(control => control.markAsTouched());
            return;
        }
        
        this.loading.set(true);
        this.error.set('');
        this.successMessage.set('');

        try {
            const { email, password } = this.loginForm.value;
            await this.authService.login({ email: email!, password: password! });
            this.router.navigate(['/boards']);
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Login failed');
        } finally {
            this.loading.set(false);
        }
    }

    logout(): void {
        localStorage.removeItem('syncboard_token');
        localStorage.removeItem('syncboard_user');
        localStorage.removeItem('registration_complete');
        window.location.reload();
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}

