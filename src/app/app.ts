import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { LayoutService } from './services/layout-service';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideMenuComponent, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fleet-control-front');
  public router = inject(Router);
  constructor(public layoutService: LayoutService, protected authService: AuthService) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/welcome']);
    }
  }
}
