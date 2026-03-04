import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {

  @Input() isLoading: boolean = false; // controlled by parent
  @Input() loadingText: string = 'Loading...';

}
