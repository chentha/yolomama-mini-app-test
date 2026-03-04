import { Injectable } from '@angular/core';
import { General } from './general';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(
    private generalService: General
  ){

  }

  setToken(token: any) {
    const encryptedToken = this.generalService.encryptFileForLocal(JSON.stringify(token))
    localStorage.setItem('token', encryptedToken);
  }

  getToken(): any | null {
    const data = localStorage.getItem('token');
    const decryptedToken = this.generalService.decryptFileForLocal(data);
    return decryptedToken;
  }

  clearToken() {
    localStorage.removeItem('token');
  }
  
}
