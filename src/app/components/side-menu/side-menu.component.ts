import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  private authService = inject(AuthService);
  isCollapsed = false;
  protected readonly routes = routes;
  protected readonly routerLink = RouterLink;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  onLogout() {
    if (confirm('Deseja realmente sair do sistema?')) {
      this.authService.logout();
    }
  }
}
