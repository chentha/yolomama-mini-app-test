import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { General } from '../../core/services/general';
import { Api } from '../../core/services/api';
// import { Khqr } from '../';
import { ActivatedRoute, Router } from '@angular/router';
import { AbaKhqr } from './aba-khqr/aba-khqr';
import { Telegram } from '../../core/services/telegram';


@Component({
  selector: 'app-payment-method',
  imports: [CommonModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.scss',
})
export class PaymentMethod {
  transactionData: any;
  ABA_payway_data: any;
  selectedMethodId: any;
  loading = false;
  paymentMethods = [
    {
      id: '1',
      name: 'ABA KHQR',
      subtitle: 'Scan to pay with any banking app',
      icon: 'assets/gallery-icon/gallery/payment/aba-khqr.png',
    },
  ];

   private zone = inject(NgZone);

  // aba variables
  // deeplink: string = '';
  // appStore: string = '';
  // playStore: string = '';

  constructor(
    public allFunctions: General,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private telegramService: Telegram,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    // console.log('type detail', this.dataDetail);
    this.transactionData = JSON.parse(
      this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '{}'
    );
    this.ABA_payway_data = this.transactionData;
    console.log('transactionData', this.transactionData);

    // this.deeplink = this.ABA_payway_data.abapay_deeplink;
    // this.appStore = this.ABA_payway_data.app_store;
    // this.playStore = this.ABA_payway_data.play_store;

  }


  ngOnInit(){
   
  }

    //select method payment
  selectMethod(method: any) {
    this.selectedMethodId = method.id;
  }



  //aba generate qr api
  // ContinueToPayment() {
  //   const tmp_obj = {
  //     req_time: this.ABA_payway_data.req_time,
  //     merchant_id: this.ABA_payway_data.merchant_id,
  //     tran_id: this.ABA_payway_data.tran_id,
  //     firstname: this.ABA_payway_data.firstname,
  //     lastname: this.ABA_payway_data.lastname,
  //     email: this.ABA_payway_data.email,
  //     phone: this.ABA_payway_data.phone,
  //     amount: this.ABA_payway_data.amount,
  //     purchase_type: this.ABA_payway_data.purchase_type,
  //     payment_option: this.ABA_payway_data.payment_option,
  //     items: this.ABA_payway_data.items,
  //     currency: this.ABA_payway_data.currency,
  //     callback_url: this.ABA_payway_data.callback_url,
  //     return_deeplink: this.ABA_payway_data.return_deeplink,
  //     custom_fields: this.ABA_payway_data.custom_fields,
  //     return_params: this.ABA_payway_data.return_params,
  //     payout: this.ABA_payway_data.payout,
  //     lifetime: this.ABA_payway_data.lifetime,
  //     qr_image_template: this.ABA_payway_data.qr_image_template,
  //     hash: this.ABA_payway_data.hash,
  //     purchase_url: this.ABA_payway_data.purchase_url,
  //   };

  //   this.allApi.createData(this.allApi.generateQRUrl, tmp_obj).subscribe(
  //     (response: any) => {
  //       console.log('qr generated success', response);
  //       this.openKhqr(response)
  //     },
  //     (err) => {
  //       console.log('err', err);
  //     }
  //   );
  // }
  
  ContinueToPayment() {
    this.loading = true;  
    // this.openABAMobile();
    // this.router.navigate(['/aba-aba-payment', this.allFunctions.encryptFileForLocal(JSON.stringify(this.deeplink))]);
    setTimeout(() => {
      // this.openKhqr();
      this.telegramService.getWebApp().openLink('https://yolomama-mini-app-test.vercel.app/aba-payment')
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000); 

    // this.openKhqr()
    // this.tryAbaWithKhqrFallback();
  }

  
  // openABAMobile() {
  //   const tg = this.telegramService.getWebApp();

  //   const platform: string = tg.platform ?? 'unknown';
  //   const isMobileTMA = platform === 'ios' || platform === 'android';

  //   // Non-mobile TMA (desktop, web, macos) → custom scheme can't work, go straight to KHQR
  //   if (!isMobileTMA) {
  //     this.openKhqr();
  //     return;
  //   }

  //   let appOpened = false;

  //   // Telegram-native event (Bot API 7.0+)
  //   const onDeactivated = () => { appOpened = true; };

  //   // DOM fallback events
  //   const onHidden = () => {
  //     if (document.visibilityState === 'hidden') appOpened = true;
  //   };
  //   const onBlur = () => { appOpened = true; };

  //   // Attach listeners
  //   tg.onEvent?.('deactivated', onDeactivated);
  //   document.addEventListener('visibilitychange', onHidden);
  //   window.addEventListener('blur', onBlur);
  //   window.addEventListener('pagehide', onBlur);

  //   const cleanup = () => {
  //     tg.offEvent?.('deactivated', onDeactivated);
  //     document.removeEventListener('visibilitychange', onHidden);
  //     window.removeEventListener('blur', onBlur);
  //     window.removeEventListener('pagehide', onBlur);
  //   };

  //   // Open the deeplink
  //   // HTTPS Universal Link → use tg.openLink (preferred path)
  //   // Custom scheme (abamobilebank://) → fall back to window.location.href
  //   tg.openLink(this.deeplink, { try_instant_view: false });


  //   // After 2s, if nothing happened → app not installed, show KHQR
  //   setTimeout(() => {
  //     cleanup();
  //     if (!appOpened && document.visibilityState === 'visible') {
  //       this.zone.run(() => this.openKhqr());
  //     }
  //   }, 2000);
  // }


  //open poup aba khqr
  openKhqr(){
    const dialogRef = this.dialog.open(AbaKhqr,
      this.allFunctions.dialogPopupConfig('basic', 'view', '', this.ABA_payway_data, 'aba-khqr-popup')
    )
    dialogRef.afterClosed().subscribe(
      data => {
        if (data.is_closed) {
          // this.loading = false;
        }
        console.log('data', data)
      }
    )
    // this.router.navigate(['/khqr']);

  }
}
