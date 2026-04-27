import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); 
  
  console.log('Current Token Value:', token);

  if (token && token !== 'undefined' && token !== 'null') {
    return true; 
  } else {
    console.log('AuthGuard: Access Denied. Redirecting to login...');
    router.navigate(['/login']);
    return false;
  }
};