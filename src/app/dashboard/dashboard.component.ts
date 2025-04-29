import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { User } from '../core/models/user.model';
import { AccessLog } from '../core/models/access-log.model';
import { Notification } from '../core/models/notification.model';
import { UserService } from '../core/services/user.service';
import { AccessLogService } from '../core/services/access-log.service';
import { NotificationService } from '../core/services/notification.service';
import { AuthService } from '../core/services/auth.service';
import { CardManagementModule } from '../card-management/card-management.module';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, CardManagementModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  accessLogs: AccessLog[] = [];
  notifications: Notification[] = [];
  unreadCount = 0;

  isLoadingUser = false;
  isLoadingLogs = false;
  isLoadingNotifications = false;

  userError: string | null = null;
  accessLogsError: string | null = null;
  notificationsError: string | null = null;

  private notificationRefreshSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private accessLogService: AccessLogService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAccessLogs();
    this.loadNotifications();
    this.setUpNotificationRefresh();
  }

  ngOnDestroy(): void {
    if (this.notificationRefreshSubscription) {
      this.notificationRefreshSubscription.unsubscribe();
    }
  }

  loadCurrentUser(): void {
    this.isLoadingUser = true;
    const userId = this.authService.userId;

    if (!userId) return;

    this.userService.getUserById(userId)
      .subscribe({
        next: (user: User) => {
          this.currentUser = user;
          this.isLoadingUser = false;
          this.userError = null;
        },
        error: (err: any) => {
          this.userError = 'No se pudo cargar la información del usuario';
          this.isLoadingUser = false;
        }
      });
  }

  loadAccessLogs(): void {
    this.isLoadingLogs = true;
    const userId = this.authService.userId;

    if (!userId) return;

    this.accessLogService.getUserAccessHistory(userId, 10)
      .subscribe({
        next: (logs: AccessLog[]) => {
          this.accessLogs = logs;
          this.isLoadingLogs = false;
          this.accessLogsError = null;
        },
        error: (err: any) => {
          this.accessLogsError = 'No se pudo cargar el historial de accesos';
          this.isLoadingLogs = false;
        }
      });
  }

  loadNotifications(): void {
    this.isLoadingNotifications = true;
    const userId = this.authService.userId;

    if (!userId) return;

    this.notificationService.getAllNotifications(userId, 0, 5)
      .subscribe({
        next: (response) => {
          this.notifications = response.notifications;
          this.isLoadingNotifications = false;
          this.notificationsError = null;
          this.loadUnreadCount();
        },
        error: (err) => {
          this.notificationsError = 'No se pudieron cargar las notificaciones';
          this.isLoadingNotifications = false;
        }
      });
  }

  loadUnreadCount(): void {
    const userId = this.authService.userId;

    if (!userId) return;

    this.notificationService.getUnreadCount(userId)
      .subscribe({
        next: (count) => {
          this.unreadCount = count;
        },
        error: (err) => {
          console.error('Error al cargar notificaciones no leídas', err);
        }
      });
  }

  markNotificationAsRead(id: number): void {
    this.notificationService.markAsRead(id)
      .subscribe({
        next: () => {
          const notification = this.notifications.find(n => n.id === id);
          if (notification) {
            notification.isRead = true;
            notification.readAt = new Date();
          }
          this.loadUnreadCount();
        },
        error: (err) => {
          console.error('Error al marcar notificación como leída', err);
        }
      });
  }

  markAllNotificationsAsRead(): void {
    const userId = this.authService.userId;

    if (!userId) return;

    this.notificationService.markAllAsRead(userId)
      .subscribe({
        next: () => {
          this.notifications.forEach(notification => {
            notification.isRead = true;
            notification.readAt = new Date();
          });
          this.unreadCount = 0;
        },
        error: (err) => {
          console.error('Error al marcar todas las notificaciones como leídas', err);
        }
      });
  }

  setUpNotificationRefresh(): void {
    // Refresh notifications every 30 seconds
    this.notificationRefreshSubscription = interval(30000)
      .pipe(
        switchMap(() => {
          const userId = this.authService.userId;
          if (!userId) {
            throw new Error('Usuario no autenticado');
          }
          return this.notificationService.getUnreadCount(userId);
        })
      )
      .subscribe({
        next: (count) => {
          if (count > this.unreadCount) {
            // If there are new notifications, refresh the list
            this.loadNotifications();
          } else {
            this.unreadCount = count;
          }
        },
        error: (err) => {
          console.error('Error al actualizar notificaciones', err);
        }
      });
  }

  getStatusClass(): string {
    if (!this.currentUser?.statusName) return '';

    switch (this.currentUser.statusName) {
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

  getAccessStatusClass(granted: boolean): string {
    return granted ? 'access-granted' : 'access-denied';
  }
}
