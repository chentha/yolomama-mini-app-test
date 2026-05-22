import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { General } from '../../../core/services/general';

@Component({
  selector: 'app-open-aba-mobile',
  imports: [],
  templateUrl: './open-aba-mobile.html',
  styleUrl: './open-aba-mobile.scss',
})
export class OpenAbaMobile {
  aba_deeplink: string = '';
  transactionData:any;
  constructor(
    public allFunctions: General,
    private route: ActivatedRoute,
  ) {
    // console.log('type detail', this.dataDetail);
    this.transactionData = JSON.parse(
      this.allFunctions.decryptFileForLocal(this.route.snapshot.paramMap.get('data')) || '{}'
    );
    console.log('transactionData', this.transactionData);
    window.location.href = this.transactionData.abapay_deeplink;


  }
}
