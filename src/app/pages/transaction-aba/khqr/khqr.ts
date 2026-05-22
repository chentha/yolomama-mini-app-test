import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { General } from '../../../core/services/general';

@Component({
  selector: 'app-khqr',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './khqr.html',
  styleUrl: './khqr.scss',
})
export class Khqr {
  // Inputs from parent
  transactionsData: any;
  shopName: string = 'GOMAMA PLAY SHV';
  amount: number = 0;
  currency: 'USD' | 'KHR' = 'USD';
  popupData: any;
  // expiresInSeconds = input<number>(300);


  // Internal state
  qrDataUrl: string = '';
  // remainingSeconds = signal<number>(0);

  // Derived
  currencySymbol = this.currency === 'USD' ? '$' : '៛';  

  //time state

  private timerId?: ReturnType<typeof setInterval>;

  initialSeconds = 0;
  remainingSeconds = signal<number>(0);
  isExpired = computed(() => this.remainingSeconds() <= 0);
  isWarning = computed(() => this.remainingSeconds() > 0 && this.remainingSeconds() <= 60);

  countdown = computed(() => {
    const s = Math.max(0, this.remainingSeconds());
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  });

  progress = computed(() => {
    if (!this.initialSeconds) return 0;
    return Math.max(0, Math.min(100, (this.remainingSeconds() / this.initialSeconds) * 100));
  });

  constructor(
      @Inject(MAT_DIALOG_DATA) public dataDetail: any,
      private allFunction: General,
      private dialogRef: MatDialogRef<Khqr>,
  ) {
    this.popupData = this.dataDetail;
    console.log('popup data', this.popupData)
    if(this.popupData){
      this.transactionsData = this.popupData.data;
      this.shopName = 'GOMAMA PLAY SHV';
      this.amount = this.popupData.data.amount;
      this.currency = this.popupData.data.currency;
      if(this.currency === 'USD'){
        this.currencySymbol = '$'; 
      }else{
        this.currencySymbol = '៛';
      }

      // Set up countdown
      const lifetime = Number(this.popupData.data.lifetime) || 300;
      this.initialSeconds = lifetime;
      this.remainingSeconds.set(lifetime);
      this.startCountdown();
      
      this.generateQR(this.transactionsData);
    }
  }

  ngOnInit() {
  
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

  startCountdown() {
    if (this.timerId) clearInterval(this.timerId);

    this.timerId = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(next);

      if (next <= 0) {
        clearInterval(this.timerId);
        // this.onExpired();
        this.onClose();
      }
    }, 1000);
  }

  // onClose(): void {
  //   if (this.timerId) clearInterval(this.timerId);
  //   this.closed.emit();
  // }

  onClose() {
    this.allFunction.closeDialogPopup(this.popupData.form_name);
    setTimeout(() => {
      this.dialogRef.close(
        { is_closed: true }
      );
    }, this.allFunction.closeFormDelay);
  }


}