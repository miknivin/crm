import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { catchError, map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    map((isAuth) => {
      console.log(isAuth);

      if (isAuth) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      console.log('errorb');

      router.navigate(['/login']);
      return new Observable<boolean>((observer) => observer.next(false));
    }),
  );
};
