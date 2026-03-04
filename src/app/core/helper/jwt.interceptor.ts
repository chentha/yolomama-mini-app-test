import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  if (!token) return next(req);

  const authReq = req.clone({
    headers: req.headers.set(
      'Authorization', `tma ${token}`
    )
  });
 

  return next(authReq);
};