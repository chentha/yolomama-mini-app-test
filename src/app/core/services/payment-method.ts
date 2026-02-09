import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethod {

  //get payment method
  getMethods() {
    return [
      { id: 'aba', name: 'ABA KHQR', image: 'assets/gallery-icon/gallery/payment/aba.png' },
      { id: 'card', name: 'Credit Card', image: 'assets/gallery-icon/gallery/payment/creadit-card.png' },
      { id: 'wing', name: 'Wing Bank', image: 'assets/gallery-icon/gallery/payment/wing.png' }
    ];
  }

}
