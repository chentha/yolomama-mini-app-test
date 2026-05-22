import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { General } from '../../core/services/general';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { Telegram } from '../../core/services/telegram';

@Component({
  selector: 'app-payment-completed',
  imports: [CommonModule],
  templateUrl: './payment-completed.html',
  styleUrl: './payment-completed.scss',
})
export class PaymentCompleted {
  orderData: any;
  selectedMethodId: any;
  loading = false;
  dataTicket: any;
  exchangeRate = 4000;


  constructor(
    public allFunctions: General,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cartService: CartService,
    private telegramService: Telegram,
  ) {
    // console.log('type detail', this.dataDetail);
    this.orderData = JSON.parse(
      this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '{}'
    );
    

    this.getTickets();
  }


  ngOnInit(){
    
  }


  //on completed and close mini app tg
  onCompleted(){
    this.telegramService.getWebApp().close();
  }

  getTickets() {
    this.cartService.getCart().subscribe((cartItems: CartItem[]) => {
      console.log('cart items', cartItems);

      this.dataTicket = cartItems.map(item => ({
        ...item.product,
        qty: item.qty
      }));  
    })
  }
  

}
