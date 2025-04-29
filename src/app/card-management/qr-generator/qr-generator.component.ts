import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss'],
  imports: [CommonModule, NgIf, NgClass]
})
export class QrGeneratorComponent implements OnInit, OnChanges {
  @Input() qrCodeData: string = '';
  @Input() size: number = 300;
  @Input() countdown: number = 30;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Component will update when qrCodeData or countdown changes
  }

  getCountdownClass(): string {
    if (this.countdown > 20) {
      return 'countdown-normal';
    } else if (this.countdown > 10) {
      return 'countdown-warning';
    } else {
      return 'countdown-danger';
    }
  }
}
