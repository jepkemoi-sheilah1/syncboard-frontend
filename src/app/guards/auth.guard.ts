import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login'], {// procted route only a user whho is loogged in can acess it, if not it will be redireted to login page and after login it will be redireted to the protected route
    queryParams: { returnUrl: state.url }
  });
  return false;
};
