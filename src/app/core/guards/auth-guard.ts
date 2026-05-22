import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cartService = inject(CartService);
  const orderService = inject(OrderService);
  const router = inject(Router);

  const url = state.url;
  // const orderId = route.paramMap.get('id');

  // STEP 1 — checkout requires cart items
  if (url.includes('checkout')) {
    if (cartService.hasItems()) return true;
    return router.createUrlTree(['product-list']);
  }

  // STEP 2 — payment-confirm requires cart items OR id in URL (reload case)
  // if (url.includes('payment-confirm')) {
  //   if (cartService.hasItems() && orderId) return true;
  //   return router.createUrlTree(['product-list']);
  // }

  // STEP 3 — payment-completed requires a completed order
  if (url.includes('payment-completed')) {
    if (orderService.getArray() && cartService.hasItems()) return true;
    return router.createUrlTree(['product-list']); 
  }

  return true;
};