import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Telegram } from '../../../core/services/telegram';
import { Auth } from '../../../core/services/auth';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
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
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.saveUserToken();
    
    // this.LoadTelegramUserInfo();
    this.hideBackButton();
    this.cartService.clear();
    this.getTicketsTypes();

    // const usertoken = this.telegramService.getWebApp().initData;
    // this.tgInfo = usertoken;
    // console.log('tg info', this.tgInfo)
  }


  saveUserToken() {
      // const initData = this.telegramService.getWebApp().initData;

      // if(initData){
      //   this.authService.setToken(initData);
      // }

      const initData = this.telegramService.getWebApp().initData;
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
        this.AllData = data?.map((item: any) => ({ ...item, qty: 0 }));
        this.cdr.detectChanges();
        console.log('all data', this.AllData);
      },
      error: (err) => {
        console.log('API error:', err); // ← check what error on reload
        // is it 401 Unauthorized? → token issue
        // is it network error?    → timing issue
      }
    });
  }


  // checkExistingData(){
  //  this.cartService.getCart().subscribe(
  //     (respone:any) =>{
  //       console.log('data cart', respone);
  //       const ExistingData = respone[0]?.product.length > 0;
  //       if(ExistingData){

  //       }else{

  //       }
  //     }
  //   )
  // }


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
    p.qty++;
    this.cdr.detectChanges();
    // this.UpdatedAllData(p);
  }


  //decrease cart
  decrease(p: any) {
    if (p.qty > 0) p.qty--;
    this.cdr.detectChanges();
    //  this.UpdatedAllData(p);
  }

  //on input in or de cart
  onQtyChange(event: Event, p: any) {
    const value = Number((event.target as HTMLInputElement).value);
    console.log('qty number', p)

    if (isNaN(value) || value < 0) {
      p.qty = 0;
    } else {
      p.qty = value;
    }
  }


  //update data added
  UpdatedAllData(data: any) {
    const index = this.AllData.findIndex(item => item.id === data.id);

    if (data.qty > 0) {
      if (index === -1) {
        this.AllData.push({ ...data });
      } else {
        this.AllData[index].qty = data.qty;
      }
    } else {
      if (index !== -1) {
        this.AllData.splice(index, 1);
      }
    }

    console.log('AllData:', this.AllData);
  }



  //add data to cart
  AddCart() {
    const selected = this.AllData.filter(item => item.qty > 0);
    this.cartService.add(selected);
  }


  get totalItems() {
    return this.AllData.reduce((a, b) => a + b.qty, 0);
  }

  get totalPrice() {
    return this.AllData.reduce((a, b) => a + (b.qty * b.price), 0);
  }
}