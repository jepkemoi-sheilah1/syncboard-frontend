import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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

  // Computed values from auth service
  isLoggedIn = computed(() => this.authService.isLoggedIn());
  userName = computed(() => {
    const user = this.authService.user();
    return user?.name || user?.email?.split('@')[0] || 'User';
  });

  ngOnInit(): void {
    // If user is already logged in, show the welcome screen (don't auto-redirect)
    // The user can click "Sign Out" to log in with a different account
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.loading.set(true);
    this.error.set('');

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login({ email: email!, password: password! });

      this.router.navigate(['/boards']);
    } catch (err) {
      this.error.set('Invalid credentials');
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    // Clear auth from localStorage
    localStorage.removeItem('syncboard_token');
    localStorage.removeItem('syncboard_user');
    
    // Update signals to reflect logged out state
    // Note: AuthService signals are private, so we need to trigger a reload
    window.location.reload();
  }
}
