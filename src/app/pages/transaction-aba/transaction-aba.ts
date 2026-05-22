import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { General } from '../../core/services/general';
import { Api } from '../../core/services/api';
import { Khqr } from './khqr/khqr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-aba',
  imports: [CommonModule],
  templateUrl: './transaction-aba.html',
  styleUrl: './transaction-aba.scss',
})
export class TransactionAba {
  transactionData: any;
  ABA_payway_data: any;
  selectedMethodId: any;
  paymentMethods = [
    {
      id: '1',
      name: 'ABA KHQR',
      subtitle: 'Scan to pay with any banking app',
      icon: 'assets/gallery-icon/gallery/payment/aba-khqr.png',
    },
  ];

  constructor(
    public allFunctions: General,
    private route: ActivatedRoute,
    private allApi: Api,
    public dialog: MatDialog,
  ) {
    // console.log('type detail', this.dataDetail);
    this.transactionData = JSON.parse(
      this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '{}'
    );
    this.ABA_payway_data = this.transactionData.data;
    console.log('transactionData', this.transactionData);

  }


  ngOnInit(){
   
  }

    //select method payment
  selectMethod(method: any) {
    this.selectedMethodId = method.id;
  }



  //aba generate qr api
  ContinueToPayment() {
    const tmp_obj = {
      req_time: this.ABA_payway_data.req_time,
      merchant_id: this.ABA_payway_data.merchant_id,
      tran_id: this.ABA_payway_data.tran_id,
      firstname: this.ABA_payway_data.firstname,
      lastname: this.ABA_payway_data.lastname,
      email: this.ABA_payway_data.email,
      phone: this.ABA_payway_data.phone,
      amount: this.ABA_payway_data.amount,
      // purchase_type: this.ABA_payway_data.purchase_type,
      payment_option: this.ABA_payway_data.payment_option,
      // items: this.ABA_payway_data.items,
      currency: this.ABA_payway_data.currency,
      // callback_url: this.ABA_payway_data.callback_url,
      // return_deeplink: this.ABA_payway_data.return_deeplink,
      // custom_fields: this.ABA_payway_data.custom_fields,
      // return_params: this.ABA_payway_data.return_params,
      // payout: this.ABA_payway_data.payout,
      // lifetime: this.ABA_payway_data.lifetime,
      // qr_image_template: this.ABA_payway_data.qr_image_template,
      hash: this.ABA_payway_data.hash,
      // purchase_url: this.ABA_payway_data.purchase_url,
    };

    this.allApi.createData(this.allApi.generateQRUrl, tmp_obj).subscribe(
      (response: any) => {
        console.log('qr generated success', response);
        this.openKhqr(response)
      },
      (err) => {
        console.log('err', err);
      }
    );
  }


  //open poup khqr
  openKhqr(data : any){
    const dialogRef = this.dialog.open(Khqr,
      this.allFunctions.dialogPopupConfig('small', data, 'khqr-popup')
    )
    dialogRef.afterClosed().subscribe(
      data => {
        if (data.is_refresh) {
        }
        console.log('data', data)
      }
    )
  }

}
