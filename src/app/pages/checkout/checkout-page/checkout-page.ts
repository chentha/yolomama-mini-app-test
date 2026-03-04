import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { PaymentMethod } from '../../../core/services/payment-method';
import { Telegram } from '../../../core/services/telegram';
import { Router } from '@angular/router';
import { Api } from '../../../core/services/api';
import { Auth } from '../../../core/services/auth';
import { Loading } from '../../../shared/components/loading/loading';
import { OrderService } from '../../../core/services/order-service';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, Loading],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  CartData: any[] = [];
  TotalPrice: any;
  selectedMethod: any;

  payment_method:any;
  purchaseOrder: any;
  tmpItems:any;
  loadingPurchase = false;

  constructor(
    public cartService: CartService,
    private paymentMethod: PaymentMethod,
    private telegramService: Telegram,
    private router: Router,
    private allApi: Api,
    private orderService: OrderService
  ){
    
  }

  ngOnInit(){
    this.getPaymentMethod()
    this.getData();
    this.showBackButton();
  }


  //show back btn in topbar mini app tg
  showBackButton(){
      this.telegramService.showBackButton();

      this.telegramService.onBack(() => {
        this.router.navigate(['/product-list']);
      });

  }


  orderPurchase() {
    this.loadingPurchase = true;
    const tmp_obj = {
      items: this.tmpItems,
      visit_date: new Date().toISOString().split('T')[0],
      notes: "Buy Tickets"
    };

    this.allApi.createData(this.allApi.orderPurchaseUrl, tmp_obj ).subscribe(
      (response: any) => {
        console.log('purchase success', response);
        this.purchaseOrder = response;
        this.loadingPurchase = false
        this.orderService.setArray(this.purchaseOrder);
        if(this.purchaseOrder){
          this.router.navigate(['/payment-confirm']);
        }
      },
      (err) => {
        this.loadingPurchase = false
        console.log('err', err);
      }
    );
  }


  //get all data cart
  getData(){
    this.cartService.getCart().subscribe(
      (respone:any) =>{
        console.log('data cart', respone);
        this.CartData = respone[0]?.product; 
        this.tmpItems = this.CartData.map(item => ({
          ticket_type_id: item.id,
          quantity: item.qty
        }));


        if(this.CartData){
          this.totalPrice();
        }
      }
    )
  }


  totalPrice(): number {
    return (this.CartData ?? []).reduce(
      (total, { price = 0, qty = 0 }) => total + (price * qty),
      0
    );
  }

    //increase cart
  increase(p: any) {
    p.qty++;
      // update tmpItems
    const item = this.tmpItems.find((t:any) => t.ticket_type_id === p.id);
    if (item) {
      item.quantity = p.qty;
    }
    this.UpdatedAllData(p);
  }


  //decrease cart
  decrease(p: any) {
    if (p.qty > 1) {
      p.qty--;
  
      const item = this.tmpItems.find((t: any) => t.ticket_type_id === p.id);
      if (item) {
        item.quantity = p.qty;
      }
  
      this.UpdatedAllData(p);
    }
    // if (p.qty > 0) p.qty--;
    // const item = this.tmpItems.find((t:any) => t.ticket_type_id === p.id);
    // if (item) {
    //   item.quantity = p.qty;
    // }

    //  this.UpdatedAllData(p);
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

    console.log('CartData:', this.CartData);
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
