import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { AUTH_MODE } from '../helper/http-context-tokens';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseApi = environment.baseAPI;
  finalBaseApi = this.baseApi

  baseApiABA = 'https://checkout-sandbox.payway.com.kh/';

  constructor(
    private http: HttpClient
  ) {

  }

  ticketsTypeUrl = '/api/online_sale/tickets/types/';
  orderPurchaseUrl = '/api/online_sale/orders/purchase/';
  paymentOrderUrl = '/api/online_sale/orders/';

  // ticketsTypeUrl = '/api/tickets/types/';
  // orderPurchaseUrl = '/api/orders/purchase/';
  // paymentOrderUrl = '/api/orders/';

  //trnsaction aba
  // abaQuickBillsUrl = '/api/payment-provider/aba-quick-bills/';
  abaQuickBillsUrl = '/api/payment-provider/aba-quick-bills/';
  generateQRUrl = '/api/payment-gateway/v1/payments/purchase';


  //get all data 
  // getAllData(url: any) {
  //   return this.http.get(this.finalBaseApi + url)
  // }
  getAllData(url: any) {
    return this.http.get(this.finalBaseApi + url);
  }

  //get detail data by id 
  getDataDetailById(url: any, id: any, filter?: any) {
    let myParams = new HttpParams()
    if (filter) {
      Object.keys(filter).forEach(function (key) {
        if (filter[key] != null) {
          myParams = myParams.append(key, filter[key])
        }
      });
    }
    return this.http.get(this.finalBaseApi + url + id + '/', { params: myParams })
  }


  //create data 
  createData(url: any, data: any) {
    return this.http.post(this.finalBaseApi + url, data);
  }


  //edit or update data 
  editData(url: any, data: any, id: any) {
    return this.http.patch(this.finalBaseApi + url + id + '/', data);
  }



  //ABA 
  createTransaction(url: string, data: any) {
    return this.http.post(this.finalBaseApi + url, data, {
      context: new HttpContext().set(AUTH_MODE, 'sid')
    });
  }

  //ABA generate QR
  generateQR(url: string, data: any) {
    return this.http.post(this.baseApiABA + url, data, {
      context: new HttpContext().set(AUTH_MODE, 'none')
    });
  }



}
