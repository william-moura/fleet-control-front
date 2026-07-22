import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification-service';
import { LaravelNotification } from '../../models/laravel-notification';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsDialogComponent } from '../../components/notifications-dialog-component/notifications-dialog-component';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  protected authService = inject(AuthService);
  protected notificationService = inject(NotificationService);
  notifications: LaravelNotification[] = [];
  unreadCount = 0;
  protected dialog = inject(MatDialog);
  userName = computed(() => this.authService.currentUser()?.name || localStorage.getItem('userName'));
  saudacao = computed(() => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getUnread().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.unreadCount = notifications.length;
        if (this.unreadCount > 0) {
          this.dialog.open(NotificationsDialogComponent, {
            width: '500px',
            data: { notifications },
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar notificações:', error);
      }
    });
  }
}
