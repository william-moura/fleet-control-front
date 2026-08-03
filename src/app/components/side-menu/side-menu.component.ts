import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { Route, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NewWindow } from '../../directives/new-window';
import { MenuItem } from '../../models/menu-item';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, NewWindow, MatIconModule, MatExpansionModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  private authService = inject(AuthService);
  isCollapsed = false;
  protected readonly routes = routes;
  protected filteredRoutes: Route[] = [];
  isOpen = signal<boolean>(false);
  menuItems = signal<MenuItem[]>([]);
  searchTerm = signal<string>('');

  filteredMenuItems = computed<MenuItem[]>(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.menuItems();

    return this.menuItems().map(item => {
      if (!item.data.name) return null;
      const matchesParent = item.data.name.toLowerCase().includes(term);
      const filteredChildren = item.children?.filter(child => 
        child.data.name.toLowerCase().includes(term)
      ) || [];

      if (matchesParent || filteredChildren.length > 0) {
        return {
          ...item,
          expanded: true,
          children: filteredChildren
        } as MenuItem;
      }
      return null;
    }).filter((item): item is MenuItem => item !== null);
  });

  constructor() {
    this.menuItems.set(this.routes.map(route => ({
      path: route.path,
      title: route.data?.['name'] as string || '',
      icon: route.data?.['icon'] as string || '',
      data: route.data as { icon: string; name: string; permission: string; display: boolean; } || {},
      children: route.children?.map(child => ({
        path: child.path,
        title: child.data?.['name'] as string || '',
        icon: child.data?.['icon'] as string || '',
        data: child.data as { icon: string; name: string; permission: string; display: boolean; } || {},
      })) || [],
    })));
  }
  // menuItems = computed<Route[]>(() => {
  //   const userPermissions = this.authService.permissions();

  //   return this.routes.filter(item => {
  //     if (item.data?.['display'] === false) {
  //       return false;
  //     }
  //     if (!item.data || !item.data['permission']) {
  //       return true;
  //     }
  //     return userPermissions.includes(item.data['permission']);
  //   });
  // });
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  onLogout() {
    if (confirm('Deseja realmente sair do sistema?')) {
      this.authService.logout();
    }
  }
  newWindow(url: string) {
    const largura = Math.round(screen.width * 0.9);
    const altura = Math.round(screen.height * 0.9);
    const configuracoesJanela = `width=${largura},height=${altura},menubar=yes,toolbar=yes,location=yes,status=yes`;
    window.open(url+'?sidebar=false', '_blank', configuracoesJanela);
  }
  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
  filterRoutes(search: string) {
    this.searchTerm.set(search);
  }
}
