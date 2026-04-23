import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  // Get reactive cart stream
  getCart() {
    return this.cart$.asObservable();
  }

  getSnapshot(): CartItem[] {
    return this.cart$.value;
  }

  // Check if cart has any items
  hasItems() {
    return this.cart$.value.length > 0;
  }

  // ========================
  // ADD SINGLE PRODUCT
  // Merges qty if product already exists
  // ========================
  add(product: any) {
    const cart = [...this.cart$.value];
    const index = cart.findIndex(i => i.product.id === product.id);

    if (index !== -1) {
      cart[index] = { ...cart[index], qty: cart[index].qty + 1 };
    } else {
      cart.push({ product, qty: 1 });
    }

    this.cart$.next(cart);
  }

  setItemQty(product: any, qty: number) {
    const cart = [...this.cart$.value];
    const index = cart.findIndex(i => i.product.id === product.id);

    if (qty <= 0) {
      // Remove from cart if qty reaches 0
      if (index !== -1) cart.splice(index, 1);
    } else if (index !== -1) {
      // Update existing
      cart[index] = { ...cart[index], qty };
    } else {
      // Add new entry
      const { qty: _, ...productData } = product;
      cart.push({ product: productData as Product, qty });
    }

    this.cart$.next(cart);
  }

  // ========================
  // ADD MANY PRODUCTS (array input)
  // Loops each item — merges qty if exists, adds new row if not.
  // This is the method to call from the product list page.
  // ========================
  addMany(products: Array<{ id: number; qty: number; [key: string]: any }>) {
    const cart = [...this.cart$.value];

    for (const product of products) {
      if (product.qty <= 0) continue;

      const index = cart.findIndex(i => i.product.id === product.id);

      if (index !== -1) {
        cart[index] = { ...cart[index], qty: cart[index].qty + product.qty };
      } else {
        const { qty, ...productData } = product;
        cart.push({ product: productData as Product, qty });
      }
    }

  this.cart$.next(cart);
}
  // ========================
  // UPDATE QTY (used on checkout page)
  // Removes item from cart if qty reaches 0
  // ========================
  updateQty(productId: number, qty: number) {
    const cart = this.cart$.value
      .map(i => (i.product.id === productId ? { ...i, qty } : i))
      .filter(i => i.qty > 0);

    this.cart$.next(cart);
  }

  // Total number of individual units across all cart items
  count() {
    return this.cart$.value.reduce((sum, i) => sum + i.qty, 0);
  }

  // Total price across all cart items
  totalPrice(): number {
    return this.cart$.value.reduce(
      (total, i) => total + (i.product.price ?? 0) * i.qty,
      0
    );
  }

  // Clear entire cart
  clear() {
    this.cart$.next([]);
    console.log('Cart cleared');
  }
}