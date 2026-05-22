import {
  Component,
  computed,
  Inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { General } from '../../../core/services/general';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-aba-khqr',
  imports: [CommonModule],
  templateUrl: './aba-khqr.html',
  styleUrl: './aba-khqr.scss',
})
export class AbaKhqr {
  // Inputs from parent
  transactionsData: any;
  shopName: string = 'GOMAMA PLAY SHV';
  amount: number = 0;
  currency: 'USD' | 'KHR' = 'USD';
  popupData: any;
  // appStore: string = '';
  // playStore: string = '';
  // deeplink: string = '';
  transactionId: any;
  // Internal state
  qrDataUrl: string = '';
  // remainingSeconds = signal<number>(0);
  // safeDeeplink!: SafeUrl;

  // Derived
  currencySymbol = this.currency === 'USD' ? '$' : '៛';

  //time state
  timerId?: ReturnType<typeof setInterval>;
  firebaseSub?: Subscription;
  paymentStatus:any;
  tran_id:any;

  //for expired time
  // initialSeconds = 0;
  // remainingSeconds = signal<number>(0);
  // isExpired = computed(() => this.remainingSeconds() <= 0);
  // isWarning = computed(() => this.remainingSeconds() > 0 && this.remainingSeconds() <= 60);
  
  // countdown = computed(() => {
  //   const s = Math.max(0, this.remainingSeconds());
  //   const m = String(Math.floor(s / 60)).padStart(2, '0');
  //   const sec = String(s % 60).padStart(2, '0');
  //   return `${m}:${sec}`;
  // });

  // progress = computed(() => {
  //   if (!this.initialSeconds) return 0;
  //   return Math.max(0, Math.min(100, (this.remainingSeconds() / this.initialSeconds) * 100));
  // });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDetail: any,
    public allFunction: General,
    private dialogRef: MatDialogRef<AbaKhqr>,
    private FirebaseService: FirebaseService,
    private router: Router
  ) {
    this.popupData = this.dataDetail;
    console.log('popup data', this.popupData)
    if (this.popupData) {
      this.transactionsData = this.popupData.data;
      this.shopName = this.allFunction.formatAppName(this.popupData.data.merchant_id);
      console.log('merchant id', this.shopName)
      this.amount = this.popupData.data.amount;
      this.currency = this.popupData.data.currency;
      this.transactionId = this.popupData.data.tran_id;
      if (this.currency === 'USD') {
        this.currencySymbol = '$';
      } else {
        this.currencySymbol = '៛';
      }

      // this.deeplink = this.popupData.data.abapay_deeplink;
      // this.appStore = this.popupData.data.app_store;
      // this.playStore = this.popupData.data.play_store;

      // Set up countdown
      // const lifetime = Number(this.popupData.data.lifetime);
      // console.log('lifetime', lifetime);
      // this.initialSeconds = lifetime;
      // this.remainingSeconds.set(lifetime * 60);
      // this.startCountdown();

      this.generateQR(this.transactionsData);
    }
  }

  ngOnInit() {
    this.listenTransaction()
  }

  //generate QR code function
  private async generateQR(data: any): Promise<void> {
    try {
      const dataUrl = await QRCode.toDataURL(data.qrString, {
        width: 480,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#ffffff' },
      });
      this.qrDataUrl = dataUrl;
    } catch (err) {
      console.error('QR generation failed', err);
    }
  }


  //Fire listener
  listenTransaction(){
    // const id = 1;
    // console.log('Listening for transaction updates with ID:', id);
    this.FirebaseService.listenTransaction(this.transactionId).subscribe({
      next: (data:any) => {
        console.log('Transaction update:', data);
        // if (status === 'paid' || status === 'approved' || status === 'success') {
        //   this.paymentStatus.set('paid');
        //   this.onPaymentSuccess(data);
        // } else if (status === 'failed' || status === 'declined' || status === 'cancelled') {
        //   this.paymentStatus.set('failed');
        //   this.onPaymentFailed();
        // }
        const tmp_data = {
          tran_id: this.transactionId,
          amount: this.amount,
          currency: this.currency,
          created_at: this.transactionsData.created_at
        }
        if(data.status ==='succeed'){
          this.onClose();
          setTimeout(() => {
            this.router.navigate(['/payment-completed', this.allFunction.encryptFileForLocal(JSON.stringify(tmp_data))]);
          }, 200);
          // this.router.navigate(['/payment-completed', this.allFunction.encryptFileForLocal(JSON.stringify(tmp_data))]);
        }
        
      },
      error: (err) => {
        console.error('Firebase listener error:', err);
      }
    });

  }


  //on payment success
  // onPaymentSuccess(data: any) {
    
  //   if(this.timerId) clearInterval(this.timerId);
  //   this.firebaseSub?.unsubscribe();

  //   console.log('Payment successful:', data);
  //   this.onClose();
  // }

  // //on payment failed
  // onPaymentFailed() {
  //   this.firebaseSub?.unsubscribe();
  // }


  // startCountdown() {
  //   if (this.timerId) clearInterval(this.timerId);

  //   this.timerId = setInterval(() => {
  //     const next = this.remainingSeconds() - 1;
  //     this.remainingSeconds.set(next);

  //     if (next <= 0) {
  //       clearInterval(this.timerId);
  //       // this.onExpired();
  //       // this.onClose();
  //     }
  //   }, 1000);
  // }

  // onClose(): void {
  //   if (this.timerId) clearInterval(this.timerId);
  //   this.closed.emit();
  // }

  // askingConfirmToCancel() {
  //   Swal.fire({
  //     width: '370px',   
  //     title: 'Cancel payment?',
  //     text: "Your transaction will be cancelled and you'll need to start over.",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, cancel',
  //     cancelButtonText: 'Keep paying',
  //     confirmButtonColor: '#C72929',
  //     cancelButtonColor: '#1D9E75',
  //   }).then((result) => {
  //     console.log('User confirmed cancellation', result);
  //     if (result.isConfirmed) {
  //       this.onClose();
  //     }
  //   });
  // }

  onClose() {
    this.allFunction.closeDialogPopup(this.popupData.form_name);
    if (this.timerId) clearInterval(this.timerId);
    this.firebaseSub?.unsubscribe();
    setTimeout(() => {
      this.dialogRef.close(
        { is_closed: true }
      );
    }, this.allFunction.closeFormDelay);
  }


}
