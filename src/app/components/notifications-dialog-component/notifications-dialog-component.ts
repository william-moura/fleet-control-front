import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LaravelNotification } from '../../models/laravel-notification';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-notifications-dialog-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './notifications-dialog-component.html',
  styleUrl: './notifications-dialog-component.scss',
})
export class NotificationsDialogComponent {
  notifications: LaravelNotification[] = [];
  notificationService = inject(NotificationService);

  constructor(
    public dialogRef: MatDialogRef<NotificationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.notifications = data.notifications;
  }
  verMotorista(notification: LaravelNotification) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        if (this.notifications.length === 0) {
          this.dialogRef.close();
        }
        const url = window.location.origin + '/driver/edit/' + notification.data.driver_id;
        const largura = Math.round(screen.width * 0.9);
        const altura = Math.round(screen.height * 0.9);
        const configuracoesJanela = `width=${largura},height=${altura},menubar=yes,toolbar=yes,location=yes,status=yes`;
    
        // Abre a nova janela com as configurações desejadas
        window.open(url+'?sidebar=false', '_blank', configuracoesJanela);
      },
      error: (error) => {
        console.error('Erro ao marcar como lido:', error);
      }
    })
  }
  fechar() {
    this.dialogRef.close();
  }
  
}
