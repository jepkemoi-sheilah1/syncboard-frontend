//defines the models related to authntification ....that is the login ,registeration and user details(the interfaces )

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}


export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    sirName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface EmailVerificationRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}