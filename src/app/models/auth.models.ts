// src/app/models/auth.models.ts
// Simple authentication models

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    sirName: string;
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ForgotPassword {
    email: string;
}

export interface ResetPassword {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface DeleteAccountResponse {
    success: boolean;
    message: string;
}


