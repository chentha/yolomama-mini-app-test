import { Component } from '@angular/core';
import { Api } from '../../core/services/api';
import { OrderService } from '../../core/services/order-service';
import { Telegram } from '../../core/services/telegram';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-payment-completed',
  imports: [],
  templateUrl: './payment-completed.html',
  styleUrl: './payment-completed.scss',
})
export class PaymentCompleted {
  paymentData:any;
  loadingPayment = false;

  constructor(
    private allApi:Api,
    private orderService: OrderService,
    private telegramService: Telegram,
    private authService: Auth
  ){
    
  }

  ngOnInit(){
  
    this.paymentData = this.orderService.getArray();
    // if(this.orderData){
    //   this.idPurchase = this.orderData.id;
    // }
    // console.log('data ', this.orderData);

    // this.showBackButton()
    this.hideBackButton()

  }

   //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
  }

  closeApp(){
    this.telegramService.getWebApp().close();
    this.authService.clearStorage()
  }


  get formattedVisitDate() {
    const d = new Date(this.paymentData.visit_date);
    console.log('date format', d)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
  }

}
