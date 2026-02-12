import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart$ = new BehaviorSubject<CartItem[]>([]);
  dataCart:any;

  //get all product list
  getCart() {
    return this.cart$.asObservable();
  }


  //check product has or not
  hasItems() {
    console.log('has item', this.cart$.value.length > 0)
    return this.cart$.value.length > 0;
  }


  //add cart product
  add(product: any) {
    const cart = this.cart$.value;
    const item = cart.find(i => i.product.id === product.id);

    if (item) item.qty++;
    else cart.push({ product: product, qty: 1 });

    this.cart$.next([...cart]);


    console.log('data add cart', this.cart$)
  }


  //update qty product
  updateQty(productId: number, qty: number) {
    const cart = this.cart$.value.map(i =>
      i.product.id === productId ? { ...i, qty } : i
    ).filter(i => i.qty > 0);

    this.cart$.next(cart);
  }


  //total price product
  // total(): number {
  //   return this.cart$.value.reduce((total, item) => {
  //     return total + (item.price * item.qty);
  //   }, 0);
  // }

  //count product
  count() {
    return this.cart$.value.reduce((sum, i) => sum + i.qty, 0);
  }


  // Clear all items from cart
  clear() {
    this.cart$.next([]);
    console.log('Cart cleared');
  }


}
