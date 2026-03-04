import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Functional HTTP Interceptor for Angular 17+
 * Automatically adds Authorization Bearer token to all API requests
 * Handles 401 errors by redirecting to login
 * 
 * NOTE: Temporarily modified to not redirect on 401 errors since
 * authentication is bypassed for development
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Get token from localStorage
  const token = localStorage.getItem('syncboard_token');

  // If token exists, clone the request and add authorization header
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid - redirect to login
          // Temporarily disabled for development
          // localStorage.removeItem('syncboard_token');
          // localStorage.removeItem('syncboard_user');
          // router.navigate(['/login']);
          console.warn('Auth error (401):', error.message);
        }
        return throwError(() => error);
      })
    );
  }

  // If no token, pass the request through unchanged
  return next(req);
};
