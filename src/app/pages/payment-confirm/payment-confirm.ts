import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Api } from '../../core/services/api';
import { Telegram } from '../../core/services/telegram';
import { ActivatedRoute, Router } from '@angular/router';
// import { Loading } from '../../shared/components/loading/loading';
import { OrderService } from '../../core/services/order-service';
import { Loading } from '../../shared/components/loading/loading';

@Component({
  selector: 'app-payment-confirm',
  imports: [CommonModule, Loading],
  templateUrl: './payment-confirm.html',
  styleUrl: './payment-confirm.scss',
})
export class PaymentConfirm {
  idPurchase:any;
  orderData:any;
  checkOrderData:any;
  loadingPayment = false;

  constructor(
    private allApi:Api,
    private telegramService: Telegram,
    private route: ActivatedRoute,
    private router: Router,
    // private generalService: General,
    private orderService: OrderService
  ){
    
  }

  ngOnInit(){
  
    this.idPurchase = this.route.snapshot.paramMap.get('id');
    this.checkOrderData = this.orderService.getArray();
    console.log('check order detail', this.checkOrderData, this.idPurchase)

    if (this.checkOrderData && this.checkOrderData.id === this.idPurchase) {
      this.orderData = this.checkOrderData; 
    } else {
      this.getOrderDetail();
    }

    // this.showBackButton()
    this.hideBackButton()

  }

  //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
  }


  //show back btn in topbar mini app tg
  // showBackButton(){
  //     this.telegramService.showBackButton();

  //     this.telegramService.onBack(() => {
  //       this.router.navigate(['/checkout']);
  //     });
  // }

  getOrderDetail(){
    this.allApi.getDataDetailById(this.allApi.paymentOrderUrl, this.idPurchase).subscribe(
      (response: any) => {
        console.log('data order detail', response);
        this.loadingPayment = false;
        this.orderData = response;
        this.orderService.setArray(response);
      },
      (err) => {
        console.log('err', err);
        this.loadingPayment = false;
      }
    )
  }


  paymentOrder(){
    this.loadingPayment = true;
    // this.telegramService.getWebApp().close();
    this.allApi.createData(this.allApi.paymentOrderUrl + this.idPurchase + '/pay-sample/', this.idPurchase).subscribe(
      (response: any) => {
        console.log('pard success', response);
        this.loadingPayment = false;
        this.router.navigate(['/payment-completed']); 
      },
      (err) => {
        console.log('err', err);
        this.loadingPayment = false;
      }
    );
  }

  get formattedVisitDate() {
    const d = new Date(this.orderData.visit_date);
    console.log('date format', d)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
  }

}
