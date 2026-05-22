import { HttpContextToken } from '@angular/common/http';

/** Header strategy for a request. Default = JWT (tma token). */
export type AuthMode = 'jwt' | 'sid' | 'none';

export const AUTH_MODE = new HttpContextToken<AuthMode>(() => 'jwt');