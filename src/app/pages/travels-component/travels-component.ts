import { DatePipe } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NewWindow } from '../../directives/new-window';
import { Travel } from '../../models/travel';
import { Router } from '@angular/router';
import { TravelService } from '../../sevices/travel-service';
import { Pagination } from '../../models/pagination';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    'acoes',
  ];
  dataSource = new MatTableDataSource<Travel>([]);
  sort = viewChild.required(MatSort);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  router = inject(Router);
  travelService = inject(TravelService);
  private snackBar = inject(MatSnackBar);
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  newTravel() {
    this.router.navigate(['/travel/new']);
  }
  editTravel(travel: Travel) {
    this.router.navigate(['/travel/edit', travel.id]);
  }
  deleteTravel(travel: Travel) {
    this.travelService.deleteTravel(travel.id).subscribe({
      next: () => {
        this.getTravels();
        this.snackBar.open('Viagem excluída com sucesso', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erro ao excluir viagem', 'Fechar', { duration: 3000 });
      },
    });
  }
  viewTravel(travel: Travel) {
    this.router.navigate(['/travel/view', travel.id]);
  }
  getTravels() {
    this.travelService.getTravels(this.indicePagina, this.pageSize).subscribe((travels: Pagination<Travel>) => {
      this.dataSource.data = travels.data;
      this.totalRegistros = travels.total;
    });
  }
  ngOnInit() {
    this.getTravels();
  }
}
