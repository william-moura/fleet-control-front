import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appNewWindow]'
})
export class NewWindow {

  @Input('appNewWindow') url: string | undefined;
  @Input() rotaId: number | string | undefined;
  constructor(private router: Router) { }

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    // Previne o comportamento padrão caso seja uma tag <a>
    event.preventDefault();

    if (!this.url) {
      console.warn('Diretiva appAbrirJanela: Nenhuma rota foi fornecida.');
      return;
    }

    // Monta a árvore de comandos de rota de forma segura
    const comandos = this.rotaId !== undefined ? [this.url, this.rotaId] : [this.url];

    // Serializa a rota interna do Angular para uma URL do navegador
    const url = this.router.serializeUrl(
      this.router.createUrlTree(comandos)
    );
    const largura = Math.round(screen.width * 0.9);
    const altura = Math.round(screen.height * 0.9);
    const configuracoesJanela = `width=${largura},height=${altura},menubar=yes,toolbar=yes,location=yes,status=yes`;

    // Abre a nova janela com as configurações desejadas
    window.open(url, '_blank', configuracoesJanela);
  }

}
