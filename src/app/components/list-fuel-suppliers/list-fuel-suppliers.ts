import { Component, effect, Input, signal } from '@angular/core';
import { FuelSupply } from '../../models/fuel-supply';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-list-fuel-suppliers',
  imports: [MatCardModule, 
    MatListModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule,   CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe],
  templateUrl: './list-fuel-suppliers.html',
  styleUrl: './list-fuel-suppliers.scss',
})
export class ListFuelSuppliers {
  @Input() fuelSupplies = signal<FuelSupply[]>([]);
  dataSource = new MatTableDataSource<FuelSupply>([]);
  
  constructor() {
    effect(() => {
      const fuelSupplies = this.fuelSupplies();
      if (fuelSupplies.length > 0) {
        this.dataSource.data = fuelSupplies;
      }
    });
  }



  colunas = ['fuelSupplierDate', 'fuelSupplierQuantity', 'fuelSupplierTotal'];
}
