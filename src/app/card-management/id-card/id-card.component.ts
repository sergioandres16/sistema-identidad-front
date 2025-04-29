import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { NgIf, NgFor, NgClass, NgStyle, DatePipe } from '@angular/common';
import { CardStatusComponent }  from '../card-status/card-status.component';
import { QrGeneratorComponent } from '../qr-generator/qr-generator.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import {Card} from '../../core/models/card.model';
import {interval, Subscription} from 'rxjs';
import {CardService} from '../../core/services/card.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector:    'app-id-card',
  standalone:  true,
  templateUrl: './id-card.component.html',
  styleUrls:   ['./id-card.component.scss'],
  imports: [
    /* Angular */
    CommonModule, NgIf, NgFor, NgClass, NgStyle, DatePipe,
    /* Propios */
    CardStatusComponent,
    QrGeneratorComponent,
    LoadingSpinnerComponent
  ]
})
export class IdCardComponent implements OnInit, OnDestroy {
  card: Card | null = null;
  isLoading = false;
  error: string | null = null;
  qrRefreshSubscription: Subscription | null = null;
  qrAutoRefresh = true;
  qrCountdown = 30; // Seconds until QR refresh
  currentQrCountdown = 30;

  constructor(
    private cardService: CardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCard();
    this.startQrAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.qrRefreshSubscription) {
      this.qrRefreshSubscription.unsubscribe();
    }
  }

  loadCard(): void {
    this.isLoading = true;
    const userId = this.authService.userId;

    if (!userId) {
      this.error = 'Usuario no autenticado';
      this.isLoading = false;
      return;
    }

    this.cardService.getCardByUserId(userId)
      .subscribe({
        next: (card) => {
          this.card = card;
          this.isLoading = false;
          this.error = null;
          this.currentQrCountdown = this.qrCountdown;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el carnet digital';
          this.isLoading = false;
        }
      });
  }

  renewQrCode(): void {
    if (!this.card) return;

    this.isLoading = true;
    this.error = null;

    this.cardService.renewQrCode(this.card.id)
      .subscribe({
        next: (qrCodeBase64) => {
          if (this.card) {
            this.card.qrCodeBase64 = qrCodeBase64;
          }
          this.isLoading = false;
          this.currentQrCountdown = this.qrCountdown;
        },
        error: (err) => {
          this.error = 'No se pudo renovar el código QR';
          this.isLoading = false;
        }
      });
  }

  toggleQrAutoRefresh(): void {
    this.qrAutoRefresh = !this.qrAutoRefresh;

    if (this.qrAutoRefresh) {
      this.startQrAutoRefresh();
    } else if (this.qrRefreshSubscription) {
      this.qrRefreshSubscription.unsubscribe();
      this.qrRefreshSubscription = null;
    }
  }

  startQrAutoRefresh(): void {
    // First unsubscribe if already subscribed
    if (this.qrRefreshSubscription) {
      this.qrRefreshSubscription.unsubscribe();
    }

    // Create timer that ticks every second
    this.qrRefreshSubscription = interval(1000)
      .subscribe(() => {
        this.currentQrCountdown--;

        if (this.currentQrCountdown <= 0 && this.card && this.qrAutoRefresh) {
          // Time to refresh QR code
          this.renewQrCode();
        }
      });
  }

  getStatusClass(): string {
    if (!this.card) return '';

    switch (this.card.status) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'DEBT':
        return 'status-debt';
      case 'EXPIRED':
        return 'status-expired';
      default:
        return '';
    }
  }
}
