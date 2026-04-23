import { Injectable } from '@angular/core';
import { General } from './general';
import { Telegram } from './telegram';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private token: string | null = null; 
  constructor(
    private generalService: General,
    private telegramService: Telegram
  ){

  }


  initToken(){
    const existingToken = this.getToken();
    if(existingToken){
      console.log('existing token', existingToken);
      return;
    }else{
      const usertoken = this.telegramService.getWebApp().initData;
      console.log('saved new token', usertoken)
      if (usertoken) {
        this.setToken(usertoken)
      }
    }
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token)
    console.log('Token saved in memory.');
  }


  getToken(): string | null {
    return sessionStorage.getItem('token');
  }


  hasToken(): boolean {
    return !!this.token;
  }



    /**
   * Save or update token in service memory
  //  * @param token string
  //  */
  // setToken(token: string) {
  //   this.token = token;
  //   console.log('Token saved in memory.');
  // }

  /**
   * Get token from service memory
   */
  // getToken(): string | null {
  //   return this.token;
  // }

  /**
   * Check if token exists in memory
   */
  // hasToken(): boolean {
  //   return !!this.token;
  // }

  /**
   * Clear token from memory
   */
  // clearToken() {
  //   this.token = null;
  //   console.log('Token cleared from memory.');
  // }

  // setToken(token: any) {
  //   const encryptedToken = this.generalService.encryptFileForLocal(token);
  //   localStorage.setItem('token', encryptedToken);
  // }

  // getToken(): any | null {
  //   const data = localStorage.getItem('token');
  //   const decryptedToken = this.generalService.decryptFileForLocal(data);
  //   return decryptedToken;
  // }

  // clearToken() {
  //   localStorage.removeItem('token');
  // }

  // clearStorage(){
  //   localStorage.clear();
  // }
  
}
