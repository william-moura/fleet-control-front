import { Component, HostListener, inject, signal } from '@angular/core';
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
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    // IMPORTANTE: O navegador não garante tempo para chamadas assíncronas normais aqui.
    // É recomendado usar uma requisição síncrona (ex: sendBeacon ou AJAX síncrono).
    //this.authService.logout;
    //localStorage.clear();
    //event.preventDefault();
  }
}
