// src/app/components/auth/register/register.ts
// Simple registration component

import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = signal(false);
    error = signal('');
    successMessage = signal('');

    registerForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/boards']);
        }
    }

    private initForm(): void {
        this.registerForm = this.fb.group({
            sirName: ['', [Validators.required, Validators.minLength(2)]],
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (!password || !confirmPassword) return null;
        if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        if (confirmPassword.hasError('passwordMismatch')) confirmPassword.setErrors(null);
        return null;
    }

    get sirName() { return this.registerForm.get('sirName'); }
    get firstName() { return this.registerForm.get('firstName'); }
    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }
    get confirmPassword() { return this.registerForm.get('confirmPassword'); }

    async onSubmit(): Promise<void> {
        if (this.registerForm.invalid) {
            Object.values(this.registerForm.controls).forEach(control => control.markAsTouched());
            return;
        }

        this.loading.set(true);
        this.error.set('');
        this.successMessage.set('');

        try {
            const { sirName, firstName, email, password } = this.registerForm.value;
            await this.authService.register({ sirName: sirName!, firstName: firstName!, email: email!, password: password!, confirmPassword: password! });
            this.successMessage.set('Account created successfully! Redirecting to login...');
            setTimeout(() => window.location.href = '/login', 1500);
        } catch (err: unknown) {
            this.error.set(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            this.loading.set(false);
        }
    }
}

