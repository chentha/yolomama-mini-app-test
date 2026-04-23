import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Telegram } from '../../core/services/telegram';

@Component({
  selector: 'app-payment-method',
  imports: [],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.scss',
})
export class PaymentMethod {
  dataPurchase:any;
  selectedMethodId: any;
  loading = false;
  paymentMethods = [
    {
      id: '1',
      name: 'ABA KHQR',
      subtitle: 'Scan to pay with any banking app',
      icon: 'assets/gallery-icon/gallery/payment/aba-khqr.png',
    },
    {
      id: '2',
      name: 'Credit/Debit Card',
      icon: 'assets/gallery-icon/gallery/payment/credit-card1.png',
      cardBrands: ['visa', 'master', 'union', 'jcb'],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private telegramService: Telegram,
  ) {

  }


  ngOnInit(){
    this.dataPurchase =  this.route.snapshot.paramMap.get('data');
    console.log('data purchase', this.dataPurchase)
    this.showBackButton();
  }


  showBackButton() {
    this.telegramService.showBackButton();

    this.telegramService.onBack(() => {
      this.router.navigate(['/checkout']);
    });

  }

  selectMethod(method: any) {
    this.selectedMethodId = method.id;
    // trigger navigation or emit output here
  }

  ContinueWithPayment() {
    // this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 2000);
    this.router.navigate(['/aba-payment', this.dataPurchase]);
  }
  
}
