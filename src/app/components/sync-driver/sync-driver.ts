import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Component, effect, EventEmitter, inject, Input, output, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Driver } from '../../models/driver';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sync-driver',
  imports: [MatCardModule, 
    MatListModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule,   CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe],
  templateUrl: './sync-driver.html',
  styleUrl: './sync-driver.scss',
})
export class SyncDriver {
  @Input() drivers = signal<Driver[]>([]);
  dataSource = new MatTableDataSource<Driver>([]);
  // @Output() deleteDriver = output<Driver>();
  public deleteDriverEmit = output<Driver>();
  colunas = ['driverName', 'driverLicenseCategory', 'action'];
  private dialog = inject(MatDialog);
  constructor() {
    effect(() => {
      this.dataSource.data = this.drivers();
    });
  }
  async deleteDriver(driver: Driver) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '600px',
      data: {
        title: 'Remover Motorista',
        message: `Tem certeza que deseja remover o motorista ${driver.driverName} deste veículo?`,
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.deleteDriverEmit.emit(driver);
    }
  }
}
