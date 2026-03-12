import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  isCollapsed = false;
  protected readonly routes = routes;
  protected readonly routerLink = RouterLink;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
