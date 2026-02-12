// src/app/components/auth/register/register.ts
// Simple registration component

import { Component, inject, signal, computed, OnInit } from '@angular/core';
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
    showPassword = signal(false);
    showConfirmPassword = signal(false);

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

    passwordStrength = computed(() => {
        const password = this.registerForm?.get('password')?.value || '';
        const requirements = {
            minLength: password.length >= 8,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[@$!%*?&]/.test(password)
        };
        
        const metCount = Object.values(requirements).filter(Boolean).length;
        const strength = (metCount / 5) * 100;
        
        let level = 'weak';
        if (strength >= 100) level = 'strong';
        else if (strength >= 60) level = 'medium';
        
        return { strength, level, requirements, metCount };
    });

    togglePasswordVisibility(): void {
        this.showPassword.update(v => !v);
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword.update(v => !v);
    }

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
            await this.authService.register({ 
                sirName: sirName!, 
                firstName: firstName!, 
                email: email!, 
                password: password!, 
                confirmPassword: password! 
            });
            this.successMessage.set('Account created! Please check your email and click the confirmation link to activate your account.');
            setTimeout(() => window.location.href = '/login', 5000);
        } catch (err: unknown) {
            this.error.set(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            this.loading.set(false);
        }
    }
}

