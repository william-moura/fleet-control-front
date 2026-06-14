import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { Component, effect, Input, signal } from '@angular/core';
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
import { VehicleFine } from '../../models/vehicle-fine';

@Component({
  selector: 'app-list-driver-fine',
  imports: [MatCardModule, 
    MatListModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule,   CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe],
  templateUrl: './list-driver-fine.html',
  styleUrl: './list-driver-fine.scss',
})
export class ListDriverFine {
  @Input() driverFines = signal<VehicleFine[]>([]);
  dataSource = new MatTableDataSource<VehicleFine>([]);
  colunas = ['valor', 'description', 'veiculo',  'data', 'pontos'];
  
  constructor() {
    effect(() => {
      const driverFines = this.driverFines();
      if (driverFines.length > 0) {
        this.dataSource.data = driverFines;
      }
    });
  }
}
