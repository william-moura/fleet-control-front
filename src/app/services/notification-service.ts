import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LaravelNotification } from '../models/laravel-notification';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  getUnread(): Observable<LaravelNotification[]> {
    return this.http.get<LaravelNotification[]>(`${this.apiUrl}/admin/notifications/unread`);
  }
  
  markAsRead(notification_id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/admin/notifications/${notification_id}/read`, {});
  }
    
}
