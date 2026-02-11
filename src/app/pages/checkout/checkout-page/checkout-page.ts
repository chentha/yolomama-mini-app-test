import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { PaymentMethod } from '../../../core/services/payment-method';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  CartData: any[] = [];
  TotalPrice: any;
  selectedMethod: any;

   payment_method:any;

  constructor(
    public cartService: CartService,
    private paymentMethod: PaymentMethod
  ){
    
  }

  ngOnInit(){
    this.getPaymentMethod()
    this.getData();
  }

  getData(){
    this.cartService.getCart().subscribe(
      (respone:any) =>{
        // console.log('data cart', respone);
        this.CartData = respone[0]?.product; 

        if(this.CartData){
          this.totalPrice();
        }
      }
    )
  }


  totalPrice(): number {
    return this.CartData?.reduce((total, item) => {
      return total + (item.price * item.qty);
    }, 0);
  }


    //increase cart
  increase(p: any) {
    p.qty++;
    this.UpdatedAllData(p);
  }


  //decrease cart
  decrease(p: any) {
    if (p.qty > 0) p.qty--;
     this.UpdatedAllData(p);
  }

  //on input in or de cart
  onQtyChange(event: Event, p: any) {
    const value = Number((event.target as HTMLInputElement).value);
    console.log('qty number', p)

    if (isNaN(value) || value < 0) {
      p.qty = 0;
    } else {
      p.qty = value;
    }
  }


    //update data added
  UpdatedAllData(data: any) {
    const index = this.CartData.findIndex(item => item.id === data.id);

    if (data.qty > 0) {
      if (index === -1) {
        this.CartData.push({ ...data });
      } else {
        this.CartData[index].qty = data.qty; 
      }
    } else {
      if (index !== -1) {
        this.CartData.splice(index, 1); 
      }
    }

    // console.log('CartData:', this.CartData);
  }


  //update qty product
  updateCart(data:any){
    this.cartService.updateQty(data.id, data.qty);
  }




  getPaymentMethod(){
    this.payment_method = this.paymentMethod.getMethods();
    console.log('payment method', this.payment_method)
  }


  selectPaymentMethod(method: any) {
    this.selectedMethod = method;
  }

  // get totalItems() {
  //   return this.products.reduce((a, b) => a + b.qty, 0);
  // }

  // get totalPrice() {
  //   return this.products.reduce((a, b) => a + (b.qty * b.price), 0);
  // }
}
