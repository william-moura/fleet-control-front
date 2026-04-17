import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true // Se estiver usando Angular moderno
})
export class UppercaseDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    // Converte para maiúsculo
    input.value = input.value.toUpperCase();
    
    // Mantém a posição do cursor correta
    input.setSelectionRange(start, end);
  }
}
