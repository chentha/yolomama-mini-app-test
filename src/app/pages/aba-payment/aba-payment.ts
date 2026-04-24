import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../core/services/api';
import { Telegram } from '../../core/services/telegram';
import { General } from '../../core/services/general';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aba-payment',
  imports: [CommonModule],
  templateUrl: './aba-payment.html',
  styleUrl: './aba-payment.scss',
})
export class AbaPayment {
  loadingPayment = false;
  dataPurchase:any;
  totalPriceUSD:any = 0;
  totalPriceKHR:any = 0;
  Currency = 'USD';

  constructor(
    private allApi: Api,
    private route: ActivatedRoute,
    private telegramService: Telegram,
    private allFunctions: General
  ) {
    this.dataPurchase = JSON.parse(this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '' );
    if(this.dataPurchase){
      this.totalPriceUSD = this.dataPurchase.totalPriceUSD;
      this.totalPriceKHR = this.dataPurchase.totalPriceKHR;
      this.Currency = this.dataPurchase.currency || 'USD';
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
