import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Telegram } from '../../core/services/telegram';
import { General } from '../../core/services/general';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ScriptLoaderService } from '../../core/services/script-loader.service';
import { Loading } from '../../shared/components/loading/loading';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, Loading],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
})
export class Transaction {
   paymentMethods = [
    {
      id: '1',
      name: 'ABA KHQR',
      subtitle: 'Scan to pay with any banking app',
      icon: 'assets/gallery-icon/gallery/payment/aba-khqr.png',
    },
  ];

  dataPurchase: any;
  selectedMethodId: any;
  loading = false;
  // scriptsReady = false;
  totalPriceUSD: any = 0;
  totalPriceKHR: any = 0;
  Currency: any = 'USD';
  ABA_payway_data: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private telegramService: Telegram,
    public allFunctions: General,
    public dialog: MatDialog,
    private scriptLoader: ScriptLoaderService,
  ) {
    this.dataPurchase = JSON.parse(
      this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '{}'
    );
    this.ABA_payway_data = this.dataPurchase.data;
    console.log('Decrypted purchase data:', this.dataPurchase);
    if (this.dataPurchase) {
      this.totalPriceUSD = this.dataPurchase.totalPriceUSD;
      this.totalPriceKHR = this.dataPurchase.totalPriceKHR;
      this.Currency = this.dataPurchase.currency;
    }
  }

  // ngOnInit() {
  //   this.showBackButton();
  //   this.loadCheckoutScript().then(() => {
  //     }).catch(error => {
  //       console.error('Error loading script:', error);
  //     });
  //   // this.loadCheckoutPaywayScript().then(() => {
  //   //   this.loadCheckoutScript().then(() => {
  //   //   }).catch(error => {
  //   //     console.error('Error loading script:', error);
  //   //   });
  //   // }).catch(error => {
  //   //   console.error('Error loading script:', error);
  //   // });
  // }


  //load ABA checkout script
  loadCheckoutPaywayScript(): Promise<void> {
      const scriptUrl = 'https://checkout.payway.com.kh/plugins/checkout2-0.js'; 
      return this.scriptLoader.loadScript(scriptUrl);
  }

  loadCheckoutScript(): Promise<void> {
      const scriptUrl = '../../../assets/js/aba-checkout.js';
      return this.scriptLoader.loadScript(scriptUrl);
  }



  showBackButton() {
    this.telegramService.showBackButton();
    this.telegramService.onBack(() => {
      this.router.navigate(['/checkout']);
    });
  }

  //select method payment
  selectMethod(method: any) {
    this.selectedMethodId = method.id;
  }


  //click continue to payment
  ContinueWithPayment() {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      const form = document.getElementById('checkout_button') as HTMLFormElement;
      if (form) {
        // window.open('', 'aba_webservice');
        form.click();
      }
      this.loading = false;
    }, 3000);
  }


  // ContinueWithPayment() {
  //   // if (this.loading || !this.scriptsReady) return;
  //   // this.AbaQuickBill();

  //   const form = document.getElementById('aba_merchant_request') as HTMLFormElement;
  //   if (form) {
  //     const fd = new FormData(form);
  //     console.group('FORM SUBMISSION');
  //     for (const [k, v] of fd.entries()) {
  //       console.log(`${k} = "${v}" (length: ${(v as string).length})`);
  //     }
  //     console.groupEnd();
  //   }
  // }


}
