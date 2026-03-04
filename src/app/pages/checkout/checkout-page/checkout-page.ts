import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { PaymentMethod } from '../../../core/services/payment-method';
import { Telegram } from '../../../core/services/telegram';
import { Router } from '@angular/router';
import { Api } from '../../../core/services/api';
import { HttpHeaders } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';

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
  
  purchaseOrder: any;
  tmpItems:any;

  constructor(
    public cartService: CartService,
    private paymentMethod: PaymentMethod,
    private telegramService: Telegram,
    private router: Router,
    private allApi: Api,
    private authService: Auth
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


  // orderPurchase(){
  //   let tmp_obj = {
  //     "items": this.tmpItems,    
  //     "visit_date": "2025-08-15",
  //     "notes": "Birthday party for Sam"
  //   }
  //   this.allApi.createData(this.allApi.orderPurchaseUrl, tmp_obj).subscribe(
  //     (repsones:any) =>{
  //       console.log('purchase success', repsones);
  //       this.purchaseOrder = repsones;
  //     }, (err) =>{
  //       console.log('err', err)
  //     }
  //   )
  // }

  // import { HttpHeaders } from '@angular/common/http';

orderPurchase() {
  const tmp_obj = {
    items: this.tmpItems,
    visit_date: "2025-08-15",
    notes: "Birthday party for Sam"
  };

  // const token = this.authService.getToken()
    const token = 'query_id=AAG7AlRrAAAAALsCVGv3q5Zo&user=%7B%22id%22%3A1800667835%2C%22first_name%22%3A%22Hour%20Chentha%22%2C%22last_name%22%3A%22-%20%E1%9E%A0%E1%9F%8A%E1%9E%BD%E1%9E%9A%20%E1%9E%85%E1%9E%B7%E1%9E%93%E1%9F%92%E1%9E%90%E1%9E%B6%22%2C%22username%22%3A%22Hour_Chentha%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FWPJ2z4bxPl8diYtCXEr6rVUrCkaUI1AHAMcH3ZnHnOo.svg%22%7D&auth_date=1772594745&signature=mF01NZkTo4qsJSNBLiR1y8TnlGtPXoi6BGqBLx7wd7ll8paC_YLE7FiNFifIQ7bzaFjneGZ-x8K52ZDd68dEDg&hash=8a113bbf94c19ff6c6ce914b7e4c4a35e685913c1eac54bea1a3e1058dcefbc1';

  alert(token)
  // Add custom headers
  const headers = new HttpHeaders({
    'Authorization': `tma ${token}`, // replace with dynamic token if needed
    'Content-Type': 'application/json',   
  });

  this.allApi.createData(this.allApi.orderPurchaseUrl, tmp_obj, headers ).subscribe(
    (response: any) => {
      console.log('purchase success', response);
      this.purchaseOrder = response;
    },
    (err) => {
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
          id: item.id,
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
