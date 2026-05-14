import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VehicleFine } from '../../models/vehicle-fine';
import { FormAddVehicleFine } from '../../forms/form-add-vehicle-fine/form-add-vehicle-fine';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleFineService } from '../../services/vehicle-fine-service';
import { Pagination } from '../../models/pagination';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { KilometerService } from '../../services/kilometer-service';
import { Kilometer } from '../../models/kilometer';
import { firstValueFrom } from 'rxjs';
import { FormAddKmComponent } from '../../forms/form-add-km-component/form-add-km-component';
import { VehicleService } from '../../services/vehicle-service';
import { FormAddKmFull } from '../../forms/form-add-km-full/form-add-km-full';

@Component({
  selector: 'app-km-component',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule, CommonModule],
  templateUrl: './km-component.html',
  styleUrl: './km-component.scss',
})
export class KmComponent {
  displayedColumns: string[] = ['vehicle', 'currentKilometers', 'totalFines', 'costKilometer', 'acoes'];
  dataSource = new MatTableDataSource<Kilometer>([]);
  // paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private kilometerService = inject(KilometerService);
  private vehicleService = inject(VehicleService);
  kilometers = signal<Kilometer[]>([]);
  ngOnInit() {
    this.kilometerService.getKilometers(this.indicePagina, this.pageSize).subscribe((kilometers) => {
        this.dataSource.data = kilometers.data;
        this.totalRegistros = kilometers.total;
        this.indicePagina = kilometers.current_page - 1;
        this.pageSize = kilometers.per_page;
        this.isLoading.set(false);
    });
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getKilometers();
  }
  getKilometers() {
    this.isLoading.set(true);
    this.kilometerService.getKilometers(this.indicePagina, this.pageSize).subscribe({
      next: (kilometers: Pagination<Kilometer>) => {
        this.dataSource.data = kilometers.data;
        this.totalRegistros = kilometers.total;
        this.indicePagina = kilometers.current_page - 1;
        this.pageSize = kilometers.per_page;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar quilometragem:', error);
        this.isLoading.set(false);
      }
    });
  }
  async deleteKilometer(kilometer: Kilometer) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Quilometragem',
        message: 'Tem certeza que deseja excluir a quilometragem?',
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.kilometerService.deleteKilometer(kilometer.id).subscribe({
        next: () => {
          this.getKilometers();
          this.snackBar.open('Quilometragem excluída com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao excluir quilometragem:', error);
          this.snackBar.open('Erro ao excluir quilometragem', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  async updateKilometer(kilometer: Kilometer) {
    const dialogRef = this.dialog.open(FormAddKmComponent, {
      width: '600px',
      data: kilometer,
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.kilometerService.updateKilometer(kilometer.id, result).subscribe({
        next: () => {
          this.getKilometers();
          this.snackBar.open('Quilometragem atualizada com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error) => {
          console.error('Erro ao atualizar quilometragem:', error);
          this.snackBar.open('Erro ao atualizar quilometragem', 'Fechar', { duration: 3000 });
        },
      });
    }
  }
  openAddKmDialog() {
    const dialogRef = this.dialog.open(FormAddKmFull, {
      width: '600px',
      data: null,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.kilometerService.createKilometer(result).subscribe({
          next: () => {
            this.getKilometers();
            this.snackBar.open('Quilometragem adicionada com sucesso', 'Fechar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Erro ao adicionar quilometragem:', error);
            this.snackBar.open('Erro ao adicionar quilometragem', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
