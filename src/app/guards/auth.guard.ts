import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// BYPASS AUTHENTICATION - Temporarily disabled for development
// TODO: Re-enable authentication when backend is ready
export const authGuard: CanActivateFn = (route, state) => {
  // Always allow access to protected routes (bypassing authentication)
  return true;
  
  // Original authentication logic (commented out):
  // const authService = inject(AuthService);
  // const router = inject(Router);
  // 
  // if (authService.isLoggedIn()) {
  //   return true;
  // }
  // 
  // router.navigate(['/login'], {
  //   queryParams: { returnUrl: state.url }
  // });
  // return false;
};
