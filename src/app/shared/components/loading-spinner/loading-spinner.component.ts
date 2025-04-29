import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  imports: [CommonModule, NgClass]
})
export class LoadingSpinnerComponent {
  @Input() size: 'small'|'medium'|'large' = 'medium';
  @Input() color: 'primary'|'secondary'|'light'|'dark' = 'primary';
}
