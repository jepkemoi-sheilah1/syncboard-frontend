//defines the models related to authntification ....that is the login ,registeration and user details(the interfaces )

// User interface - represents a registered user
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;  // Optional phone field
    createdAt: Date;
}

// Auth response from login/register API
export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

// Login credentials
export interface LoginCredentials {
    email: string;
    password: string;
}


// Registration credentials (Step 1 - before OTP)
export interface RegisterCredentials {
    sirName: string;          // Sir name
    firstName: string;        // First name
    email: string;            // Email for OTP verification
    password: string;
    confirmPassword: string;
}

// OTP Verification Request (Step 2)
export interface VerifyOTPRequest {
    email: string;            // Email address used for registration
    otp: string;              // 6-digit OTP code
}

// Resend OTP Request
export interface ResendOTPRequest {
    email: string;
}

// Registration Response with verification status
export interface RegisterResponse {
    success: boolean;
    message: string;
    requiresVerification: boolean;  // true if OTP needed
    email?: string;                 // email address for OTP reference
    user?: User;                    // Only returned after complete registration
    token?: string;                 // Only returned after complete registration
}

// Email verification (for future use)
export interface EmailVerificationRequest {
    email: string;
}

// Forgot password (for future use)
export interface ForgotPasswordRequest {
    email: string;
}

// Reset password (for future use)
export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}
