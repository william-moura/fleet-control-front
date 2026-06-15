import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, signal, Input, computed, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Maintenance } from '../../models/maintenance';

@Component({
  selector: 'app-list-maintenance',
  imports: [MatListModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule,   CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe],
  templateUrl: './list-maintenance.html',
  styleUrl: './list-maintenance.scss',
})
export class ListMaintenance {
  @Input() maintenances = signal<Maintenance[]>([]);
  dataSource = new MatTableDataSource<Maintenance>([]);

  colunas = ['maintenanceDate', 'maintenanceCost', 'maintenanceServices'];
  constructor() {
    effect(() => {
      const maintenances = this.maintenances();
      if (maintenances.length > 0) {
        this.dataSource.data = maintenances;
      }
    });
  }
}
