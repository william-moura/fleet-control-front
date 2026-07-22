// notification.model.ts
export interface LaravelNotification {
    id: string;
    type: string;
    data: {
      title: string;
      message: string;
      driver_id: number;
      type: 'error' | 'warning' | 'info';
      url: string;
    };
    read_at: string | null;
    created_at: string;
  }
  