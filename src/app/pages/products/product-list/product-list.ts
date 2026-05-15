import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Telegram } from '../../../core/services/telegram';
import { Auth } from '../../../core/services/auth';
import { Api } from '../../../core/services/api';
import { General } from '../../../core/services/general';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  AllData: any[] = [];
  UserInfo: any;
  checkUserInfo: any;
  // tgInfo: any;

  constructor(
    private cartService: CartService,
    private telegramService: Telegram,
    private authService: Auth,
    private allApi: Api,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public allFunction: General
  ) {

  }

  ngOnInit() {
    // this.saveUserToken(); 
    
    // this.LoadTelegramUserInfo();
    this.hideBackButton();
    // this.cartService.clear();
    this.getTicketsTypes();
    console.log('data added', this.cartService.getCart())

    // const usertoken = this.telegramService.getWebApp().initData;
    // this.tgInfo = usertoken;
    // console.log('tg info', this.tgInfo)
  }


  saveUserToken() {

      // const initData = this.telegramService.getWebApp().initData;
      const initData = 'query_id=AAG7AlRrAAAAALsCVGu8u1XV&user=%7B%22id%22%3A1800667835%2C%22first_name%22%3A%22Hour%20Chentha%22%2C%22last_name%22%3A%22-%20%E1%9E%A0%E1%9F%8A%E1%9E%BD%E1%9E%9A%20%E1%9E%85%E1%9E%B7%E1%9E%93%E1%9F%92%E1%9E%90%E1%9E%B6%22%2C%22username%22%3A%22Hour_Chentha%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FWPJ2z4bxPl8diYtCXEr6rVUrCkaUI1AHAMcH3ZnHnOo.svg%22%7D&auth_date=1778827026&signature=Tcx2JAXKGPjXOd67twsaO-h4m7EKb4JJtQySW5bgSFm1yli15As7EoH1JSx1FqrtA-jkTCNE71WmMvvcBau8Dw&hash=b0bb5fb71d8679de45a0bb8c253a1bd4e1cbdb46469ff85a2d80cb3e5155fe58'; 
      console.log('init data', initData)

      if (initData) {
        // Save token in memory only
        this.authService.setToken(initData);
      }
    
  }

  //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
  }


  getTicketsTypes() {
    this.allApi.getAllData(this.allApi.ticketsTypeUrl).subscribe({
      next: (response: any) => {
        const data = response?.data || response;
        const currentCart = this.cartService.getSnapshot();

        this.AllData = data.map((item: any) => {
          // If this product is already in the cart, restore its qty
          const cartItem = currentCart.find(c => c.product.id === item.id);
          return { ...item, qty: cartItem ? cartItem.qty : 0 };
        });
          // this.AllData = data?.map((item: any) => ({ ...item, qty: 0 }));
          this.cdr.detectChanges();
          console.log('all data', this.AllData);
      },
      error: (err) => {
        console.log('API error:', err); 
      }
    });
  }



  // async LoadTelegramUserInfo() {
  //   this.checkUserInfo = this.telegramService.getUserInStorage();
  //   // const checkUserTg = this.telegramService.getWebApp().initDataUnsafe?.user;
  //   if (this.checkUserInfo) {
  //     console.log('Loaded UserInfo from localStorage:', JSON.parse(this.checkUserInfo));
  //     this.UserInfo = JSON.parse(this.checkUserInfo);
  //     return;
  //   }

  //   console.log('wep app is work ')

  //   const webApp = this.telegramService.getWebApp();
  //   const user = webApp.initDataUnsafe?.user || null;

  //   this.UserInfo = {
  //     id: user?.id || null,
  //     firstName: user?.first_name || null,
  //     lastName: user?.last_name || null,
  //     username: user?.username || null,
  //     phone_number: null
  //   };

  //   try {
  //     const result = await this.telegramService.requestPhoneNumber();
  //     this.UserInfo.phone_number = result.phone;
  //     this.telegramService.saveUserInStorage(this.UserInfo);
  //   } catch (error) {
  //     this.telegramService.saveUserInStorage(this.UserInfo);
  //   }
  // }


  //increase cart
  increase(p: any) {
    // p.qty++;
    // if(p.qty < p.max_per_order){
      p.qty++;
      this.cartService.setItemQty(p, p.qty);
      this.cdr.detectChanges();
    // }
  }


  //decrease cart
  decrease(p: any) {
    if (p.qty > 0) p.qty--;
    this.cartService.setItemQty(p, p.qty); 
    this.cdr.detectChanges();
  }

  //on input in or de cart
  // onQtyChange(event: Event, p: any) {
  //   const value = Number((event.target as HTMLInputElement).value);
  //   console.log('qty number', p)

  //   if (isNaN(value) || value < 0) {
  //     p.qty = 0;
  //   } else {
  //     p.qty = value;
  //   }
  // }


  //update data added
  // UpdatedAllData(data: any) {
  //   const index = this.AllData.findIndex(item => item.id === data.id);

  //   if (data.qty > 0) {
  //     if (index === -1) {
  //       this.AllData.push({ ...data });
  //     } else {
  //       this.AllData[index].qty = data.qty;
  //     }
  //   } else {
  //     if (index !== -1) {
  //       this.AllData.splice(index, 1);
  //     }
  //   }

  //   console.log('AllData:', this.AllData);
  // }


  //add data to cart
  // AddCart() {
  //   const selected = this.AllData.filter(item => item.qty > 0);
 
  //   if (selected.length === 0) {
  //     console.log('No items selected');
  //     return;
  //   }
 
  //   this.cartService.addMany(selected);
  //   console.log('Added to cart:', selected);
 
  //   // Reset local quantities after adding
  //   this.AllData = this.AllData.map(item => ({ ...item, qty: 0 }));
  //   this.cdr.detectChanges();
  // }

  AddCart() {
    if (this.cartService.count() === 0) {
      console.log('No items selected');
      return;
    }
    
    this.router.navigate(['/checkout']);
  }
 

  get totalItems() {
    return this.AllData.reduce((a, b) => a + b.qty, 0);
  }

  get totalPrice() {
    return this.AllData.reduce((a, b) => a + (b.qty * b.effective_price), 0);
  }

  
}