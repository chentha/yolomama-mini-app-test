import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class General {
  
  //The get method is use for encrypt the value.
  encryptFileForLocal(value:any) {
    var key = CryptoJS.enc.Utf8.parse(environment.localEncriptKey);
    var iv = CryptoJS.enc.Utf8.parse(environment.localEncriptKey);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  decryptFileForLocal(value:any) {
    if (value != null) {
      var key = CryptoJS.enc.Utf8.parse(environment.localEncriptKey);
      var iv = CryptoJS.enc.Utf8.parse(environment.localEncriptKey);
      var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    }
    else {
      return null;
    }
  }

}
