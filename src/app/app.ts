import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { LayoutService } from './services/layout-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideMenuComponent, AsyncPipe, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fleet-control-front');
  public router = inject(Router);
  private channel = new BroadcastChannel('app_session_channel');
  private activeTabsCount = 1;
  withSidebar: boolean = true;
  constructor(public layoutService: LayoutService, protected authService: AuthService) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    const sidebar = window.location.search.split('sidebar=')[1];
    console.log(sidebar,'sidebar');
    if (sidebar === 'false') {
      this.withSidebar = false;
    }
    // 1. Avisa as abas existentes que uma nova aba foi aberta
    this.channel.postMessage({ type: 'TAB_OPENED' });

    // 2. Escuta mensagens das outras abas
    this.channel.onmessage = (event) => {
      if (event.data.type === 'TAB_OPENED') {
        this.activeTabsCount++;
        // Responde para a nova aba saber que não está sozinha
        this.channel.postMessage({ type: 'TAB_ALREADY_EXISTS' });
      } else if (event.data.type === 'TAB_ALREADY_EXISTS') {
        this.activeTabsCount++;
      } else if (event.data.type === 'TAB_CLOSED') {
        this.activeTabsCount--;
      }
    };
  }

  @HostListener('window:beforeunload', ['$event'])
  handleTabClose($event: BeforeUnloadEvent) {
    // Avisa as outras abas que esta está fechando
    this.channel.postMessage({ type: 'TAB_CLOSED' });

    // SÓ LIMPA SE FOR A ÚLTIMA ABA ABERTA DO SITE
    if (this.activeTabsCount <= 1) {
      // 1. Limpa o token do localStorage
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
      // 2. Avisa o servidor (opcional)
      const url = 'https://sysmanager.tech';
      navigator.sendBeacon(url, JSON.stringify({ reason: 'last_tab_closed' }));

      // 3. Ativa o pop-up de confirmação do navegador
      $event.preventDefault();
      $event.returnValue = '';
    }
  }

  ngOnDestroy() {
    // Fecha o canal se o componente for destruído internamente
    this.channel.close();
  }
}
