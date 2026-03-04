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
  checkUserInfo:any;
  tgInfo:any;

  constructor(
    private cartService: CartService,
    private telegramService: Telegram,
    private authService: Auth,
    private allApi: Api,
    private cdr: ChangeDetectorRef
  ) {
   
  }

  ngOnInit(){
    this.saveUserToken();

    // this.LoadTelegramUserInfo();
    this.hideBackButton();
    this.cartService.clear();

    // const usertoken = this.telegramService.getWebApp().initData;
    // this.tgInfo = usertoken;
    // console.log('tg info', this.tgInfo)
  }


  saveUserToken(){
  
    // const usertoken = this.telegramService.getWebApp().initData;

    const usertoken = 'query_id=AAG7AlRrAAAAALsCVGuSp_lG&user=%7B%22id%22%3A1800667835%2C%22first_name%22%3A%22Hour%20Chentha%22%2C%22last_name%22%3A%22-%20%E1%9E%A0%E1%9F%8A%E1%9E%BD%E1%9E%9A%20%E1%9E%85%E1%9E%B7%E1%9E%93%E1%9F%92%E1%9E%90%E1%9E%B6%22%2C%22username%22%3A%22Hour_Chentha%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FWPJ2z4bxPl8diYtCXEr6rVUrCkaUI1AHAMcH3ZnHnOo.svg%22%7D&auth_date=1772609469&signature=jgBBqdy4jx4NllBsDJ5so7r5e9bl2fRvGvTnEKPX_ZxSguoDL_WNJ_gN-dT0VrmXDQjBglSGBkdLu8_60zsxAg&hash=5fb4aebcf242cad1478a697c33d5e8b557a1b9db7689865ff41a6a2d922e8b9e'
    // alert(usertoken)
    if(usertoken){
      this.authService.setToken(usertoken);
      this.getTicketsTypes();
    }

  }


  //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
  }


  getTicketsTypes(){
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


  async LoadTelegramUserInfo() {
    this.checkUserInfo = this.telegramService.getUserInStorage();
    // const checkUserTg = this.telegramService.getWebApp().initDataUnsafe?.user;
    if (this.checkUserInfo) {
      console.log('Loaded UserInfo from localStorage:', JSON.parse(this.checkUserInfo));
      this.UserInfo = JSON.parse(this.checkUserInfo);
      return;
    }

    console.log('wep app is work ')

    const webApp = this.telegramService.getWebApp();
    const user = webApp.initDataUnsafe?.user || null;

    this.UserInfo = {
      id: user?.id || null,
      firstName: user?.first_name || null,
      lastName: user?.last_name || null,
      username: user?.username || null,
      phone_number: null
    };

    try {
      const result = await this.telegramService.requestPhoneNumber();
      this.UserInfo.phone_number = result.phone;
      this.telegramService.saveUserInStorage(this.UserInfo);
    } catch (error) {
      this.telegramService.saveUserInStorage(this.UserInfo);
    }
  }


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