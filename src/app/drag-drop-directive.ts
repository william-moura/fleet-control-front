import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true
})
export class DragDropDirective {
  // Emite o arquivo para o componente pai
  @Output() filesDropped = new EventEmitter<File>();

  // Quando o arquivo é arrastado sobre a área
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Quando o arquivo sai da área
  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  // Quando o arquivo é solto na área
  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    
    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Verifica se é imagem
      if (file.type.startsWith('image/')) {
        this.filesDropped.emit(file);
      }
    }
  }
}
