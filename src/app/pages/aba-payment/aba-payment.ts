import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../core/services/api';
import { Telegram } from '../../core/services/telegram';
import { General } from '../../core/services/general';

@Component({
  selector: 'app-aba-payment',
  imports: [],
  templateUrl: './aba-payment.html',
  styleUrl: './aba-payment.scss',
})
export class AbaPayment {
  loadingPayment = false;
  dataPurchase:any;
  totalPrice:any = 0;

  constructor(
    private allApi: Api,
    private route: ActivatedRoute,
    private telegramService: Telegram,
    private allFunctions: General
  ) {
    this.dataPurchase = JSON.parse(this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '' );
    if(this.dataPurchase){
      this.totalPrice = this.dataPurchase.totalPriceUSD;
    }
    console.log('data purchase', this.dataPurchase)
  }

  ngOnInit(){
   this.hideBackButton()
  }

     //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
  }

  closeApp(){
    this.telegramService.getWebApp().close();
    // this.authService.clearStorage()
  }


  paymentOrder() {
    this.loadingPayment = true;
    // this.telegramService.getWebApp().close();
    this.allApi.createData(this.allApi.paymentOrderUrl + this.dataPurchase.id + '/pay-sample/', '').subscribe(
      (response: any) => {
        console.log('pard success', response);
        this.closeApp();
        this.loadingPayment = false;
      },
      (err) => {
        console.log('err', err);
        this.loadingPayment = false;
      }
    );
  }

}
