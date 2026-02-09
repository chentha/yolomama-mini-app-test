import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  baseApi = environment.baseAPI;
  finalBaseApi = this.baseApi

  constructor(
    private http: HttpClient
  ){

  }


  //get all data 
  getAllData(url: any) {
    return this.http.get(this.finalBaseApi + url)
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


}
