// Email Confirmation Component
// Handles email verification link clicks

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-email-confirm',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './email-confirm.html',
    styleUrl: './email-confirm.css'
})
export class EmailConfirmComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    loading = signal(true);
    success = signal(false);
    error = signal('');
    userEmail = signal('');

    ngOnInit(): void {
        this.verifyEmail();
    }

    private verifyEmail(): void {
        // Get token from URL query parameters
        const token = this.route.snapshot.queryParamMap.get('token');

        if (!token) {
            this.loading.set(false);
            this.error.set('Invalid confirmation link. No token found.');
            return;
        }

        // Simulate backend verification
        this.authService.verifyEmail(token).then((isVerified: boolean) => {
            this.loading.set(false);
            if (isVerified) {
                this.success.set(true);
                // Auto-redirect to login after 3 seconds
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            } else {
                this.error.set('Verification failed. Please try again.');
            }
        }).catch((err: Error) => {
            this.loading.set(false);
            this.error.set(err.message || 'Verification failed');
        });
    }

    resendEmail(): void {
        this.router.navigate(['/register']);
    }
}

