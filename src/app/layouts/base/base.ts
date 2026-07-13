import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-base',
  imports: [RouterOutlet],
  templateUrl: './base.html',
  styleUrl: './base.scss',
})
export class Base {
  public router = inject(Router);
  
  constructor(public layoutService: LayoutService, protected authService: AuthService) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}
