import { DatePipe } from '@angular/common';
import { Component, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NewWindow } from '../../directives/new-window';
import { Travel } from '../../models/travel';

@Component({
  selector: 'app-travels-component',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    NewWindow,
  ],
  templateUrl: './travels-component.html',
  styleUrl: './travels-component.scss',
})
export class TravelsComponent {
  displayedColumns: string[] = [
    'vehicle',
    'driver',
    'origin',
    'destination',
    'departureDate',
    'returnDate',
    'status',
    'acoes',
  ];
  dataSource = new MatTableDataSource<Travel>([]);
  sort = viewChild.required(MatSort);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;

  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
