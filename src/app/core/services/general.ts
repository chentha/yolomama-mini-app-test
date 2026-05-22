import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class General {

  closeFormDelay = 300;


  // format time duration from mins to h and m
  formatDuration(mins: number): string {
    if (!mins) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  //format shop name 
  formatAppName(name: string): string {
    if (!name) return '';

    // Add spaces around PLAY
    const spaced = name
      .toUpperCase()
      .replace(/PLAY/g, ' PLAY ')
      .replace(/\s+/g, ' ')
      .trim();

    // Convert to Title Case
    return spaced
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  //format khr price
  formatKhr(amount: number): string {
    return amount.toLocaleString('en-US');
  }



  // askingText(type: 'cancel' | { en: string }) {
  //   const texts: Record<string, string> = {
  //     cancel: 'You want to cancel this transaction?',
  //   };

  //   const text = typeof type === 'string' ? texts[type] : type.en;

  //   return {
  //     title: 'Are you sure?',
  //     text: text,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'Cancel',
  //     customClass: {
  //       confirmButton: 'bg-primary',
  //     },
  //   };
  // }


  dialogPopupConfig(size: 'basic' | 'small' | 'medium-small' | 'medium' | 'large' | 'xl', type?: 'add' | 'edit' | 'view', height?:any,  data?: any, form_name?: any) {
    let width = '100%'
    if (size == 'basic') { width = '370px' }
    else if (size == 'small') { width = '500px' }
    else if (size == 'medium-small') { width = '700px' }
    else if (size == 'medium') { width = '800px' }
    else if (size == 'large') { width = '1200px' }
    else if (size == 'xl') { width = '1500px' }
    let tmp_data: any = {
      width: width,
      height: height || 'auto',
      position: { center: '0' },
      disableClose: true,
      data: {
        type: type,
        form_name: form_name,
        data: data || null
      },
      // // panelClass: ["my_popup_slide" , "my_slide_left", "max-width-95"]
      // panelClass: [form_name, "animate__animated", "animate__slideInRight", "m-w-100", "animate_duration_0_5"]
      panelClass: [form_name, "m-w-100"]
    };
    return tmp_data
  }


  closeDialogPopup(form_name: any) {
    document
      .getElementsByClassName(form_name)[0]
      // .classList.remove("animate__fadeIn");
    // document
    //   .getElementsByClassName(form_name)[0]
    //   .classList.add("animate__fadeOut");
  }

  
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
