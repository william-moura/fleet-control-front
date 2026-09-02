import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, effect, inject, Input, output, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { Secretaria } from '../../models/secretaria';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-sync-secretarias',
  imports: [MatCardModule, 
    MatListModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule,   CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './sync-secretarias.html',
  styleUrl: './sync-secretarias.scss',
})
export class SyncSecretarias {
  @Input() secretarias = signal<Secretaria[]>([]);
  dataSource = new MatTableDataSource<Secretaria>([]);
  public deleteSecretariaEmit = output<Secretaria>();
  colunas = ['nome', 'orgao', 'action'];
  private dialog = inject(MatDialog);
  constructor() {
    effect(() => {
      this.dataSource.data = this.secretarias();
    });
  }
  async deleteSecretaria(secretaria: Secretaria) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      data: {
        title: 'Remover Secretaria',
        message: `Tem certeza que deseja remover a secretaria ${secretaria.nome} deste veículo?`,
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.deleteSecretariaEmit.emit(secretaria);
    }
  }
}
