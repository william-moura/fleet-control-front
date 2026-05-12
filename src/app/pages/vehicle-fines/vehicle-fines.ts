import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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

@Component({
  selector: 'app-vehicle-fines',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule, CommonModule],
  templateUrl: './vehicle-fines.html',
  styleUrl: './vehicle-fines.scss',
})
export class VehicleFines implements OnInit {
  displayedColumns: string[] = ['vehiclePlate', 'driverName', 'fineDate', 'fineAmount', 'finePaidDate', 'fineLevel', 'acoes'];
  dataSource = new MatTableDataSource<VehicleFine>([]);
  // paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private vehicleFineService = inject(VehicleFineService);
  ngOnInit() {
    this.getVehicleFines();
  }
  updateFine(fine: VehicleFine) {
    const dialogRef = this.dialog.open(FormAddVehicleFine, {
      width: '600px',
      disableClose: true,
      data: fine,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleFineService.updateVehicleFine(fine.id, result).subscribe({
          next: (fine: VehicleFine) => {
            this.snackBar.open('Multa atualizada com sucesso', 'Fechar', { duration: 3000 });
            this.getVehicleFines();
          },
          error: (error) => {
            console.error('Erro ao atualizar multa:', error);
            this.snackBar.open('Erro ao atualizar multa', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteFine(fine: VehicleFine) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Multa',
        message: 'Tem certeza que deseja excluir esta multa?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleFineService.deleteVehicleFine(fine.id).subscribe({
          next: () => {
            this.snackBar.open('Multa excluída com sucesso', 'Fechar', { duration: 3000 });
            this.getVehicleFines();
          },
        });
        error: (error: any) => {
          console.error('Erro ao excluir multa:', error);
          this.snackBar.open('Erro ao excluir multa', 'Fechar', { duration: 3000 });
        }
      }
    });
  }

  openAddFineDialog() {
    const dialogRef = this.dialog.open(FormAddVehicleFine, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleFineService.createVehicleFine(result).subscribe({
          next: (fine: VehicleFine) => {
            this.snackBar.open('Multa cadastrada com sucesso', 'Fechar', { duration: 3000 });
            this.getVehicleFines();
          },
          error: (error) => {
            console.error('Erro ao cadastrar multa:', error);
            this.snackBar.open('Erro ao cadastrar multa', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  getVehicleFines() {
    this.isLoading.set(true);
    this.vehicleFineService.getAllVehicleFines(this.indicePagina, this.pageSize).subscribe({
      next: (fines: Pagination<VehicleFine>) => {
        this.dataSource.data = fines.data;
        this.totalRegistros = fines.total;
        this.indicePagina = fines.current_page - 1;
        this.pageSize = fines.per_page;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar multas:', error);
        this.isLoading.set(false);
      }
    });
  }
}
