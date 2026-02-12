# SyncboardFrontend

A modern, responsive web application for task and project management built with Angular 21. Features a complete authentication system with email verification, session management, and protected routes.

## 🚀 Features

### Authentication System
- **User Authentication**: Complete login and registration system with form validation
- **Session Persistence**: Users stay logged in using localStorage token management
- **Welcome Back Feature**: Personalized greeting for returning logged-in users
- **Auto-Redirect**: Automatically redirects authenticated users to dashboard
- **Password Strength Indicator**: Real-time visual feedback on password strength

### Email Verification Flow
- **Complete Verification Flow**: Registration → Email Sent with Link → User Clicks Link → Verify Token → Redirect to Login
- **Email Confirmation Component**: Dedicated page for handling verification links
- **Multiple States**: Loading spinner, success confirmation, and error handling
- **Auto-Redirect**: Automatically redirects to login page after 3 seconds on success
- **Status Management**: Verification status persists and clears appropriately

### Login Page Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Custom Color Scheme**: Modern design with CSS custom properties
- **Form Validation**: Real-time email and password validation
- **Error Handling**: Clear error messages for invalid credentials
- **Loading States**: Visual feedback during authentication
- **User Avatar**: Displays user initials with gradient background
- **Waving Hand Animation**: Animated welcome icon for logged-in users
- **Quick Actions**: "Go to Dashboard" and "Sign Out" buttons for authenticated users
- **Verification Messages**: Shows success messages when email is verified or account is created

### Registration Page Features
- **Comprehensive Form**: First name, last name, email, password, confirm password
- **Password Validation**: Enforces minimum 8 characters with uppercase, lowercase, and number
- **Password Strength Meter**: Visual indicator showing weak/medium/strong password strength
- **Password Match Validation**: Confirms password and confirm password match
- **Password Visibility Toggle**: Show/hide password functionality
- **Success Redirect**: Automatically redirects to login after 5 seconds
- **Email Verification Info**: Informs users to check email for confirmation link

### Route Protection
- **Auth Guard**: Protects routes from unauthenticated access
- **Return URL Handling**: Redirects users back to intended page after login
- **Auto-Redirect**: Sends authenticated users to boards dashboard

### HTTP Interception
- **Bearer Token Injection**: Automatically adds auth token to all API requests
- **401 Error Handling**: Automatically logs out user on token expiration
- **Functional Interceptor**: Modern Angular 17+ functional interceptor pattern

### UI/UX Enhancements
- **CSS Custom Properties**: Consistent color scheme throughout the application
- **Interactive Hover Effects**: Smooth transitions on buttons and inputs
- **Loading Spinner**: Animated spinner during form submission
- **Mobile Responsive**: Optimized layouts for all screen sizes
- **Error Messages**: User-friendly error feedback
- **Angular Signals**: Reactive state management with computed values

## 🎨 Color Scheme

The application uses a modern color palette defined in CSS custom properties:

- **Primary**: `#3B82F6` (Blue)
- **Primary Dark**: `#2563EB` (Darker Blue)
- **Background**: `#F8FAFC` (Light Gray)
- **Surface**: `#FFFFFF` (White)
- **Text Primary**: `#1E293B` (Dark Text)
- **Text Secondary**: `#64748B` (Gray Text)
- **Error**: `#DC2626` (Red)
- **Success**: `#16A34A` (Green)
- **Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

## 📦 Tech Stack

- **Framework**: Angular 21
- **State Management**: Angular Signals
- **Forms**: Reactive Forms with custom validators
- **Styling**: SCSS with CSS Custom Properties
- **HTTP**: Angular HttpClient with functional interceptors
- **Routing**: Angular Router with functional guards
- **Server-Side Rendering**: Angular SSR with hydration
- **Testing**: Vitest

## 🛠️ Development

### Prerequisites

- Node.js v20+ (recommended v22.12.0)
- npm 10+

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
ng serve

# Or with npm
npm start
```

Once the server is running, open your browser and navigate to:
- **Application**: http://localhost:4200/
- **Login Page**: http://localhost:4200/login

### Demo Credentials

For testing, use these demo credentials:
- **Email**: demo@syncboard.com
- **Password**: demo123

### Build

```bash
# Production build
ng build

# Development build
ng build --configuration development
```

### Run Tests

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── email-confirm/    # Email verification component
│   │   │   ├── login/            # Login component with welcome feature
│   │   │   └── register/         # Registration component with password strength
│   │   ├── boards/               # Board management
│   │   ├── cards/                # Card components
│   │   ├── lists/                # List components
│   │   └── shared/               # Shared components
│   ├── services/
│   │   └── auth.service.ts       # Authentication service with signals & email verification
│   ├── models/
│   │   └── auth.models.ts         # TypeScript interfaces (User, AuthResponse, Credentials)
│   ├── guards/
│   │   └── auth.guard.ts         # Route guard for protected routes
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # HTTP interceptor for token injection
│   ├── pipes/                     # Custom pipes
│   └── store/                     # State management
├── styles.scss                    # Global styles and CSS variables
├── environments/                  # Environment configurations
│   ├── environment.ts
│   ├── environment.development.ts
│   └── environment.production.ts
└── assets/                       # Static assets
```

## 🔐 Authentication Flow

### Login Flow
1. User submits credentials → API validation → Token stored in localStorage
2. Session Persistence: On app reload, AuthService loads stored token and user data
3. Welcome Feature: If user is logged in, shows personalized welcome message
4. Auto-Redirect: Logged-in users accessing /login are redirected to /boards
5. Logout: Clears localStorage and refreshes the application state

### Registration Flow
1. User submits registration form with validation
2. Password strength is calculated and displayed
3. On success: Account created message shown with email verification instructions
4. Auto-redirect to login after 5 seconds

### Email Verification Flow
```
Registration → Email Sent with Link → User Clicks Link → Verify Token → Store Status → Redirect to Login with Success Message
```

1. User registers → "Account created! Check email for confirmation link"
2. User clicks confirmation link → /confirm-account?token=xxx
3. EmailConfirmComponent extracts token from URL
4. AuthService.verifyEmail(token) validates token
5. Success: Shows "Email Verified!" → Auto-redirects to login after 3 seconds
6. Login Page: Displays "Email verified successfully! Please sign in."

### Protected Routes Flow
1. User tries to access /boards without authentication
2. AuthGuard checks isLoggedIn() status
3. If not logged in: Redirects to /login with returnUrl query parameter
4. After login: User is redirected back to the original requested route

### HTTP Interceptor Flow
1. Every API request is intercepted
2. Authorization header added with Bearer token
3. On 401 response: Clears localStorage and redirects to login

## 🎯 Recent Updates

### Email Verification Implementation (Latest)
- ✅ Created EmailConfirmComponent with loading/success/error states
- ✅ Implemented verifyEmail() method in AuthService
- ✅ Added isEmailVerified() and clearVerificationStatus() methods
- ✅ Added confirm-account route
- ✅ Updated LoginComponent to show verification success messages
- ✅ Updated RegisterComponent to inform users about email verification
- ✅ Auto-redirect after verification success

### Login Page Enhancements
- ✅ Added verification success/error message display
- ✅ Shows "Account created successfully!" after registration
- ✅ Shows "Email verified successfully!" after email confirmation
- ✅ Clears verification status after displaying message

### Auth Service Enhancements
- ✅ Added email verification methods (verifyEmail, isEmailVerified, clearVerificationStatus, getVerificationError)
- ✅ Enhanced logout to clear verification status
- ✅ Mock verification logic with 1.5 second delay

### Route Protection
- ✅ Created functional authGuard using CanActivateFn
- ✅ Added returnUrl query parameter for post-login redirect
- ✅ Protects /boards route from unauthenticated access

### HTTP Interceptor
- ✅ Created functional authInterceptor using HttpInterceptorFn
- ✅ Automatically adds Bearer token to requests
- ✅ Handles 401 errors with auto-logout

### Registration Improvements
- ✅ Password strength indicator with real-time feedback
- ✅ Password visibility toggle
- ✅ Enhanced form validation
- ✅ Clear password requirements display

## 📝 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular Router](https://angular.dev/guide/routing)
- [Angular SSR](https://angular.dev/guide/ssr)
- [Vitest Testing](https://vitest.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

