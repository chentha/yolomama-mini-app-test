import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  // const token = 'query_id=AAG7AlRrAAAAALsCVGv3q5Zo&user=%7B%22id%22%3A1800667835%2C%22first_name%22%3A%22Hour%20Chentha%22%2C%22last_name%22%3A%22-%20%E1%9E%A0%E1%9F%8A%E1%9E%BD%E1%9E%9A%20%E1%9E%85%E1%9E%B7%E1%9E%93%E1%9F%92%E1%9E%90%E1%9E%B6%22%2C%22username%22%3A%22Hour_Chentha%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FWPJ2z4bxPl8diYtCXEr6rVUrCkaUI1AHAMcH3ZnHnOo.svg%22%7D&auth_date=1772594745&signature=mF01NZkTo4qsJSNBLiR1y8TnlGtPXoi6BGqBLx7wd7ll8paC_YLE7FiNFifIQ7bzaFjneGZ-x8K52ZDd68dEDg&hash=8a113bbf94c19ff6c6ce914b7e4c4a35e685913c1eac54bea1a3e1058dcefbc1';
  const token = authService.getToken()
    // const token = telegramService.getWebApp().initData; 
  if (!token) return next(req);

  const authReq = req.clone({
    headers: req.headers.set(
      'Authorization', `tma ${token}`
    )
  });
 

  return next(authReq);
};