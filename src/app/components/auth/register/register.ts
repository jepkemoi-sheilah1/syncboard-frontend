import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RegisterResponse } from '../../../models/auth.models';

type FormStep = 'register' | 'otp' | 'success';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Current step in the registration flow
  currentStep = signal<FormStep>('register');
  
  // Loading and error states
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  
  // OTP related
  otpCode = signal('');
  otpError = signal('');
  resendTimer = signal(0);
  canResendOTP = signal(true);
  
  // Email address for OTP reference
  registeredEmail = signal('');

  // Form instance
  registerForm!: FormGroup;

  // Track if registration is complete (to prevent ngOnDestroy cleanup)
  private registrationComplete = false;

  ngOnInit(): void {
    this.initForm();
    
    // If user is already logged in, redirect to boards
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/boards']);
    }
  }

  ngOnDestroy(): void {
    // Only clean up if registration is NOT complete
    if (!this.registrationComplete && this.currentStep() !== 'success') {
      this.authService.cancelRegistration();
    }
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      sirName: ['', [Validators.required, Validators.minLength(2)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/) // At least 1 lowercase, 1 uppercase, 1 digit
      ]],memoo@DESKTOP-0R6SH5S:~/Eclectics/workspace/syncboard-frontend$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   "\n/home/memoo/Eclectics/workspace/syncboard-frontend/src/app/models/auth.models.ts\n"
        deleted:    "<parameter name=\"path\">/home/memoo/Eclectics/workspace/syncboard-frontend/src/app/components/auth/login/login.css</parameter>"
        modified:   package-lock.json
        modified:   src/app/app.routes.ts
        modified:   src/app/components/auth/login/login.ts
        modified:   src/app/components/auth/register/register.css
        modified:   src/app/components/auth/register/register.html
        modified:   src/app/components/auth/register/register.ts
        new file:   src/app/components/boards/boards.ts
        modified:   src/app/models/auth.models.ts
        modified:   src/app/services/auth.service.ts

memoo@DESKTOP-0R6SH5S:~/Eclectics/workspace/syncboard-frontend$ git diff --staged --name-only
"\n/home/memoo/Eclectics/workspace/syncboard-frontend/src/app/models/auth.models.ts\n"
"<parameter name=\"path\">/home/memoo/Eclectics/workspace/syncboard-frontend/src/app/components/auth/login/login.css</parameter>"
package-lock.json
src/app/app.routes.ts
src/app/components/auth/login/login.ts
src/app/components/auth/register/register.css
src/app/components/auth/register/register.html
src/app/components/auth/register/register.ts
src/app/components/boards/boards.ts
:
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator for password match
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Clear the error if passwords match
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  // Helper getters for form controls (for template access)
  get sirName() { return this.registerForm.get('sirName'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Step 1: Submit registration form
  async onRegisterSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const { sirName, firstName, email, password } = this.registerForm.value;

      // Store registration data temporarily for OTP verification
      localStorage.setItem('pending_registration', JSON.stringify({
        sirName: sirName!,
        firstName: firstName!,
        email: email!,
        password: password!
      }));

      const response: RegisterResponse = await this.authService.register({
        sirName: sirName!,
        firstName: firstName!,
        email: email!,
        password: password!,
        confirmPassword: password!
      });

      if (response.requiresVerification) {
        this.registeredEmail.set(email!);
        this.currentStep.set('otp');
        this.startResendTimer();
        this.successMessage.set(response.message);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  // Step 2: Handle OTP input
  onOtpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    input.value = value;
    this.otpCode.set(value);
    this.otpError.set('');
  }

  // Step 2: Submit OTP for verification
  async onOtpSubmit(): Promise<void> {
    const otp = this.otpCode();
    const email = this.registeredEmail();

    if (otp.length !== 6) {
      this.otpError.set('Please enter the complete 6-digit OTP');
      return;
    }

    this.loading.set(true);
    this.otpError.set('');

    try {
      // Verify OTP and complete registration
      await this.authService.verifyOTP({ email, otp });

      // Mark registration as complete
      this.registrationComplete = true;

      // Clear pending registration data
      localStorage.removeItem('pending_registration');

      // Set success message and show success step
      this.successMessage.set('Account created successfully! Welcome to SyncBoard.');
      this.currentStep.set('success');

      // Redirect to login page after showing success message
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000); // 2 second delay to show success message

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'OTP verification failed';
      this.otpError.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  // Step 2: Resend OTP
  async onResendOTP(): Promise<void> {
    if (!this.canResendOTP()) return;

    this.loading.set(true);

    try {
      const email = this.registeredEmail();
      const response = await this.authService.resendOTP(email);
      
      if (response.success) {
        this.successMessage.set(response.message);
        this.otpCode.set('');
        this.startResendTimer();
      }
    } catch {
      this.otpError.set('Failed to resend OTP. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  // Start countdown timer for resend OTP
  private startResendTimer(): void {
    this.canResendOTP.set(false);
    this.resendTimer.set(60); // 60 seconds

    const interval = setInterval(() => {
      const current = this.resendTimer();
      if (current <= 0) {
        clearInterval(interval);
        this.canResendOTP.set(true);
      } else {
        this.resendTimer.set(current - 1);
      }
    }, 1000);
  }

  // Go back to registration form
  goBackToForm(): void {
    this.currentStep.set('register');
    this.error.set('');
    this.otpCode.set('');
    this.otpError.set('');
  }

  // Helper to mark all form controls as touched (for validation display)
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Navigate to login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navigate to boards
  goToBoards(): void {
    this.router.navigate(['/boards']);
  }
}

