import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';

export const authGuard: CanActivateFn = (route, state) => {

  const cartService = inject(CartService);
  const router = inject(Router);

  if(cartService.hasItems()){
    return true;
  }

  return router.createUrlTree(['product-list']);
};
