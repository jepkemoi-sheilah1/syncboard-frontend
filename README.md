# SyncboardFrontend

A modern, responsive web application for task and project management built with Angular 21.

## 🚀 Features

### Authentication System
- **User Authentication**: Complete login and registration system with form validation
- **Session Persistence**: Users stay logged in using localStorage token management
- **Welcome Back Feature**: Personalized greeting for returning logged-in users
- **Auto-Redirect**: Automatically redirects authenticated users to dashboard

### Login Page Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Custom Color Scheme**: Modern design with CSS custom properties
- **Form Validation**: Real-time email and password validation
- **Error Handling**: Clear error messages for invalid credentials
- **Loading States**: Visual feedback during authentication
- **User Avatar**: Displays user initials with gradient background
- **Waving Hand Animation**: Animated welcome icon for logged-in users
- **Quick Actions**: "Go to Dashboard" and "Sign Out" buttons for authenticated users

### UI/UX Enhancements
- **CSS Custom Properties**: Consistent color scheme throughout the application
- **Interactive Hover Effects**: Smooth transitions on buttons and inputs
- **Loading Spinner**: Animated spinner during form submission
- **Mobile Responsive**: Optimized layouts for all screen sizes
- **Error Messages**: User-friendly error feedback

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

## 📦 Tech Stack

- **Framework**: Angular 21
- **State Management**: Angular Signals
- **Styling**: SCSS with CSS Custom Properties
- **Testing**: Vitest
- **Server-Side Rendering**: Angular SSR

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
│   │   │   ├── login/          # Login component with welcome feature
│   │   │   └── register/       # Registration component
│   │   ├── boards/             # Board management
│   │   ├── cards/              # Card components
│   │   ├── lists/              # List components
│   │   └── shared/             # Shared components
│   ├── services/
│   │   └── auth.service.ts     # Authentication service with signals
│   ├── models/
│   │   └── auth.models.ts      # TypeScript interfaces
│   ├── guards/                  # Route guards
│   └── interceptors/           # HTTP interceptors
├── styles.scss                  # Global styles and CSS variables
├── environments/                # Environment configurations
└── assets/                     # Static assets
```

## 🔐 Authentication Flow

1. **Login**: User submits credentials → API validation → Token stored in localStorage
2. **Session Persistence**: On app reload, AuthService loads stored token and user data
3. **Welcome Feature**: If user is logged in, shows personalized welcome message
4. **Auto-Redirect**: Logged-in users accessing /login are redirected to /boards
5. **Logout**: Clears localStorage and refreshes the application state

## 🎯 Recent Updates

### Login Page Fixes (Latest)
- ✅ Fixed button visibility by defining CSS custom properties
- ✅ Added complete color scheme with proper fallbacks
- ✅ Implemented "Welcome back" feature for logged-in users
- ✅ Added waving hand animation (👋)
- ✅ Created user avatar with gradient initials display
- ✅ Added responsive design for mobile devices
- ✅ Implemented logout functionality with page refresh
- ✅ Enhanced form validation and error handling
- ✅ Added loading spinner during authentication

## 📝 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Signals](https://angular.dev/guide/signals)
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
