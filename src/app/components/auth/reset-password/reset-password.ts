import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);

    resetForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    loading = signal(false);
    error = signal('');
    successMessage = signal('');
    token = '';

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token') || '';
        if (!this.token) {
            this.error.set('Invalid reset link. Please request a new password reset.');
        }
    }

    passwordMatchValidator(form: any) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    async onSubmit() {
        if (this.resetForm.invalid) {
            Object.values(this.resetForm.controls).forEach(control => control.markAsTouched());
            return;
        }
        
        this.loading.set(true);
        this.error.set('');
        
        try {
            const { newPassword } = this.resetForm.value;
            await this.authService.resetPassword(this.token, newPassword!);
            this.successMessage.set('Password reset successfully! Redirecting to login...');
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            this.loading.set(false);
        }
    }
}

