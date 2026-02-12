import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    loading = signal(false);
    error = signal('');
    successMessage = signal('');

    async onSubmit() {
        if (this.forgotForm.invalid) {
            Object.values(this.forgotForm.controls).forEach(control => control.markAsTouched());
            return;
        }
        
        this.loading.set(true);
        this.error.set('');
        
        try {
            const { email } = this.forgotForm.value;
            await this.authService.forgotPassword(email!);
            this.successMessage.set('Password reset link sent to your email!');
            this.forgotForm.reset();
        } catch (err) {
            this.error.set(err instanceof Error ? err.message : 'Failed to send reset link');
        } finally {
            this.loading.set(false);
        }
    }
}

