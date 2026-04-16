import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { Route, RouterModule } from '@angular/router';
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
  protected filteredRoutes: Route[] = [];
  menuItems = computed<Route[]>(() => {
    const userPermissions = this.authService.permissions();

    return this.routes.filter(item => {
      if (item.data?.['display'] === false) {
        return false;
      }
      if (!item.data || !item.data['permission']) {
        return true;
      }
      return userPermissions.includes(item.data['permission']);
    });
  });
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  onLogout() {
    if (confirm('Deseja realmente sair do sistema?')) {
      this.authService.logout();
    }
  }
  // ngOnInit(): void {
  //   this.filteredRoutes = this.routes.filter(item => {
  //     console.log(item.data?.['permission'], 'hihi');
  //     if (item.data?.['permission']) {
  //       console.log('entrou no if');
  //       return this.authService.hasPermission(item.data?.['permission']);
  //     }
  //     return true;
  //   });
  // }
}
