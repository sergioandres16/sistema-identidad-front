import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass, NgIf} from '@angular/common';

@Component({
  selector:    'app-card-status',
  standalone:  true,
  templateUrl: './card-status.component.html',
  styleUrls:   ['./card-status.component.scss'],
  imports: [CommonModule, NgIf, NgClass]
})
export class CardStatusComponent implements OnInit {
  @Input() status: string = '';
  @Input() statusColor: string = '';
  @Input() isActive: boolean = true;
  @Input() expiryDate: Date | null = null;

  constructor() {}

  ngOnInit(): void {}

  getStatusText(): string {
    if (!this.isActive) {
      return 'Inactivo';
    }

    if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
      return 'Expirado';
    }

    switch (this.status) {
      case 'ACTIVE':
        return 'Activo';
      case 'INACTIVE':
        return 'Inactivo';
      case 'SUSPENDED':
        return 'Suspendido';
      case 'DEBT':
        return 'Deuda Pendiente';
      case 'PENDING':
        return 'Pendiente';
      case 'EXPIRED':
        return 'Expirado';
      default:
        return this.status || 'Desconocido';
    }
  }

  getStatusClass(): string {
    if (!this.isActive) {
      return 'status-inactive';
    }

    if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
      return 'status-expired';
    }

    switch (this.status) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'DEBT':
        return 'status-debt';
      case 'PENDING':
        return 'status-pending';
      case 'EXPIRED':
        return 'status-expired';
      default:
        return '';
    }
  }

  isExpired(): boolean {
    return !!(this.expiryDate && new Date(this.expiryDate) < new Date());
  }

  daysUntilExpiry(): number {
    if (!this.expiryDate) return 0;

    const today = new Date();
    const expiry = new Date(this.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
