import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JwtInterceptor } from './core/helper/jwt.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Auth } from './core/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([JwtInterceptor])
    )
    ,{
      provide: APP_INITIALIZER,
      useFactory: (auth: Auth) => () => auth.initToken(),
      deps: [Auth],
      multi: true
    }
  ]
};
