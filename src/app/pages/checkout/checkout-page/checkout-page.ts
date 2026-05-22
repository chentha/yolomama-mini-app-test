import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { PaymentMethod } from '../../../core/services/payment-method';
import { Telegram } from '../../../core/services/telegram';
import { Router } from '@angular/router';
import { Api } from '../../../core/services/api';
import { Loading } from '../../../shared/components/loading/loading';
import { OrderService } from '../../../core/services/order-service';
import { CartItem } from '../../../core/models/cart-item.model';
import { General } from '../../../core/services/general';
import { create } from 'qrcode';

type Currency = 'USD' | 'KHR';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, Loading],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {
  CartData: any[] = [];
  selectedMethod: any;

  payment_method: any;
  purchaseOrder: any;
  tmpItems: any;
  loadingPurchase = false;

  // Currency state
  currency:any = 'USD';
  exchangeRate = signal(4000);

  // Plain properties — recalculated via recalcTotals()
  totalPrice = 0;
  totalKhr = 0;

  constructor(
    public cartService: CartService,
    private telegramService: Telegram,
    private router: Router,
    private allApi: Api,
    private orderService: OrderService,
    public allFunctions: General
  ) {
    // Recalc whenever the exchange rate signal changes
    effect(() => {
      this.exchangeRate(); // register dependency
      this.recalcTotals();
    });
  }

  ngOnInit() {
    this.getData();
    this.showBackButton();
    this.cartService.getCurrency().subscribe(c => this.currency = c);
  }



  // Single source of truth for both totals
  recalcTotals(): void {
    this.totalPrice = (this.CartData ?? []).reduce(
      (total, { effective_price = 0, qty = 0 }) => total + (Number(effective_price) * qty),
      0
    );
    this.totalKhr = Math.round(this.totalPrice * this.exchangeRate());
  }

  // show back btn in topbar mini app tg
  showBackButton() {
    this.telegramService.showBackButton();
    this.telegramService.onBack(() => {
      this.router.navigate(['/product-list']);
    });
  }

  orderPurchase() {
    this.loadingPurchase = true;
    const tmp_obj = {
      items: this.tmpItems,
      visit_date: new Date().toISOString().split('T')[0],
      currency: this.currency,
      notes: "Buy Tickets"
    };

    this.allApi.createData(this.allApi.orderPurchaseUrl, tmp_obj).subscribe(
      (response: any) => {
        console.log('purchase success', response);
        this.purchaseOrder = response;
        this.loadingPurchase = false;
        this.orderService.setArray(this.purchaseOrder);
        const tmp_data = {
          amount: response.amount,
          currency: response.currency,
          qrString: response.qrString,
          lifetime: response.lifetime,
          merchant_id: response.merchant_id,
          tran_id: response.status.tran_id,
          created_at: response.created_at,
          abapay_deeplink: response.abapay_deeplink,
          app_store: response.app_store,
          play_store: response.play_store
        };
        // this.AbaQuickBill(tmp_data);
        this.router.navigate(['/payment-method', this.allFunctions.encryptFileForLocal(JSON.stringify(tmp_data))]);
      },
      (err) => {
        this.loadingPurchase = false;
        console.log('err', err);
      }
    );
  }

  //  AbaQuickBill(dataPurchase: any) {
  //   const tmp_obj = {
  //     order_id: dataPurchase.data.order_number,
  //     // payment_option: 'abapay_khqr',
  //     currency: dataPurchase.currency,
  //     amount: String(dataPurchase.currency === 'USD'
  //         ? dataPurchase.totalPriceUSD
  //         : dataPurchase.totalPriceKHR
  //     ),
  //   };

  //   this.allApi.createTransaction(this.allApi.abaQuickBillsUrl, tmp_obj).subscribe(
  //     (response: any) => {

  //       this.router.navigate(['/payment-method', this.allFunctions.encryptFileForLocal(JSON.stringify(response))]);
  //     },
  //     (err) => {
  //       console.error('Quick bill error:', err);
  //     }
  //   );
  // }

  // get all data cart
  getData() {
    this.cartService.getCart().subscribe((cartItems: CartItem[]) => {
      console.log('cart items', cartItems);

      this.CartData = cartItems.map(item => ({
        ...item.product,
        qty: item.qty
      }));  

      this.buildTmpItems(); // build tmpItems after CartData is set

      console.log('tmpItems', this.tmpItems);

      this.recalcTotals();   // recalc after cart loads
    });
  }


  buildTmpItems(): void {
    this.tmpItems = this.CartData.map((item: any) => ({
      ticket_type_id: item.id,
      effective_price: this.convertPrice(item.effective_price),
      // currency: this.currency,
      quantity: item.qty,
    }));

    console.log('tmpItems', this.tmpItems);
  }


  //for convert price when currency change
  convertPrice(usdPrice: number): number {
    const price = Number(usdPrice) || 0;
    return this.currency === 'KHR'
      ? Math.round(price * this.exchangeRate())
      : price;
  }



  // increase cart
  increase(p: any) {
    p.qty++;
    this.updateCart(p);

    const item = this.tmpItems.find((t: any) => t.ticket_type_id === p.id);
    if (item) item.quantity = p.qty;

    this.recalcTotals();   // recalc after qty change
  }

  //descrease cart
  decrease(p: any) {
    if (p.qty > 1) {
      p.qty--;
      this.updateCart(p);

      const item = this.tmpItems.find((t: any) => t.ticket_type_id === p.id);
      if (item) item.quantity = p.qty;

      this.recalcTotals();   // recalc after qty change
    }
  }

  // on input in or de cart
  onQtyChange(event: Event, p: any) {
    const value = Number((event.target as HTMLInputElement).value);
    console.log('qty number', p);

    p.qty = isNaN(value) || value < 0 ? 0 : value;

    this.recalcTotals();   // recalc after manual input
  }



  selectCurrency(c: Currency) {
    this.cartService.setCurrency(c);
    this.currency = c;
    this.buildTmpItems();

  }

  // update qty product
  updateCart(data: any) {
    this.cartService.updateQty(data.id, data.qty);
  }
}