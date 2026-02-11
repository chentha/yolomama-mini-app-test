import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { Telegram } from '../../../core/services/telegram';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
   products = [
    {
      id: 1,
      name: 'Ticket',
      price: 0.5,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZDmAjwx0Rk_uUanK2xYza8s99jooxQeXdlA&s',
      qty: 0
    },
    {
      id: 2,
      name: 'Snack a Jacks',
      price: 0.5,
      image: 'https://i.guim.co.uk/img/media/b78eba8720659708cba9c1c5338a7e7773a56446/0_85_4288_2572/master/4288.jpg?width=1200&quality=85&auto=format&fit=max&s=821d4a9159836868ba6e066ab0a15688',
      qty: 0
    },
    {
      id: 3,
      name: 'Marlenka',
      price: 0.5,
      image: 'https://www.coca-cola.com/content/dam/onexp/us/en/brands/coca-cola/products/creamy-vanilla-product-shot-tile.png',
      qty: 0
    },
    {
      id: 4,
      name: 'Evian',
      price: 0.5,
      image: 'https://aaashoppingcenter.ph/cdn/shop/files/2_48.png?v=1744621960',
      qty: 0
    },
    {
      id: 5,
      name: 'Evian',
      price: 0.5,
      image: 'https://camhappymart.com/storage/app/public/product/2024-03-21-65fc056f632d5.png',
      qty: 0
    },
    {
      id: 6,
      name: 'Evian',
      price: 0.5,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSetN68WTPI0FOPzkt3l5V6QfFyDpyMhrnweQ&s',
      qty: 0
    }
  ];

AllData: Product[] = [];
UserInfo: any;
checkUserInfo:any;

  constructor(
    private cartService: CartService,
    private telegramService: Telegram
  ) {

  }

  ngOnInit(){
    this.LoadTelegramUserInfo();
    this.hideBackButton();
  }


  //hide back btn in topbar tg
  hideBackButton() {
    this.telegramService.hideBackButton();
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


  //Telegram process 
  // LoadTelegramUserInfo(){

  //   //request phone number user 
  //   const phone_number = this.telegramService.requestPhoneNumber();
  //   const webApp = this.telegramService.getWebApp();
  //   const user = webApp.initDataUnsafe?.user || null;

  //   this.UserInfo = {
  //     id: user?.id || null,
  //     firstName: user?.first_name || null,
  //     lastName: user?.last_name || null,
  //     username: user?.username || null,
  //     phone_number: phone_number
  //   }
  // }

   async LoadTelegramUserInfo() {
    this.checkUserInfo = this.telegramService.getUserInStorage();
    if (this.checkUserInfo) {
      console.log('Loaded UserInfo from localStorage:', this.checkUserInfo);
      this.UserInfo = this.checkUserInfo;
      return;
    }

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
    this.UpdatedAllData(p);
  }


  //decrease cart
  decrease(p: any) {
    if (p.qty > 0) p.qty--;
     this.UpdatedAllData(p);
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
  AddCart(){
    this.cartService.add(this.AllData);
  }


  get totalItems() {
    return this.products.reduce((a, b) => a + b.qty, 0);
  }

  get totalPrice() {
    return this.products.reduce((a, b) => a + (b.qty * b.price), 0);
  }
}
