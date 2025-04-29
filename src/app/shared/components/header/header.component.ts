import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationPanelComponent]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  unreadCount = 0;
  showNotifications = false;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.isLoggedIn = !!user;
      this.username = user?.firstName || '';

      if (this.isLoggedIn) {
        this.loadUnreadCount();
      }
    });
  }

  loadUnreadCount(): void {
    const userId = this.authService.userId;
    if (userId) {
      this.notificationService.getUnreadCount(userId)
        .subscribe(count => {
          this.unreadCount = count;
        });
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isScanner(): boolean {
    return this.authService.isScanner();
  }
}
