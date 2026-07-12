import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Component, effect, EventEmitter, Input, output, Output, signal } from '@angular/core';
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
  @Output() deleteDriver = new EventEmitter<Driver>();
  colunas = ['driverName', 'driverLicenseCategory', 'action'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.drivers();
    });
  }
}
