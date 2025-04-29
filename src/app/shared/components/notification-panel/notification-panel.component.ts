import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Notification } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    LoadingSpinnerComponent
  ]
})
export class NotificationPanelComponent implements OnInit {
  @Input() userId!: number;
  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.notificationService.getUnreadNotifications(this.userId)
      .subscribe({
        next: (data) => {
          this.notifications = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar notificaciones';
          this.isLoading = false;
        }
      });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id)
      .subscribe({
        next: () => {
          const notification = this.notifications.find(n => n.id === id);
          if (notification) {
            notification.isRead = true;
            notification.readAt = new Date();
          }
        }
      });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.userId)
      .subscribe({
        next: () => {
          this.notifications.forEach(notification => {
            notification.isRead = true;
            notification.readAt = new Date();
          });
        }
      });
  }

  onClose(): void {
    this.close.emit();
  }

  getNotificationTypeClass(type: string): string {
    switch (type) {
      case 'INFO':
        return 'notification-info';
      case 'ACCESS':
        return 'notification-access';
      case 'DEBT':
        return 'notification-debt';
      case 'SYSTEM':
        return 'notification-system';
      default:
        return '';
    }
  }
}
