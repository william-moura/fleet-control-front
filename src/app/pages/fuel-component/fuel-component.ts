import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs';
import { FuelSupplyService } from '../../services//fuel-supply-service';
import { FuelSupply } from '../../models/fuel-supply';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormAddFuelSupplier } from '../form-add-fuel-supplier/form-add-fuel-supplier';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-fuel-component',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressBarModule, MatCardModule, 
    MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './fuel-component.html',
  styleUrl: './fuel-component.scss',
})
export class FuelComponent implements OnInit{
  private fuelSupplyService = inject(FuelSupplyService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  isLoading = signal(false);
  displayedColumns: string[] = ['vehiclePlate', 'vehicleModel', 'driverName', 'supplierFantasyName','fuelSupplyDate', 
    'fuelSupplyQuantity', 'fuelSupplyTotalValue', 'acoes'];
  dataSource = new MatTableDataSource<FuelSupply>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;  
  fuelSupplies = signal<FuelSupply[]>([]);
  ngOnInit() {
    this.getFuelSupplies();
  }
  abrirModalCadastro() {
    const dialogRef = this.dialog.open(FormAddFuelSupplier, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuelSupplyService.createFuelSupply(result).subscribe({
          next: (fuelSupply) => {
            this.snackBar.open('Abastecimento cadastrado com sucesso', 'Fechar', { duration: 3000 });
            this.getFuelSupplies();
          },
          error: (error) => {
            console.error('Erro ao cadastrar abastecimento:', error);
            this.snackBar.open('Erro ao cadastrar abastecimento', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
    // this.dialog.open(FuelSupplyFormComponent, {
    //   width: '500px',
    // });
  }
  deleteFuelSupply(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Abastecimento',
        message: 'Tem certeza que deseja excluir este abastecimento?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuelSupplyService.deleteFuelSupply(id).subscribe({
          next: () => {
            this.snackBar.open('Abastecimento excluído com sucesso', 'Fechar', { duration: 3000 });
            this.getFuelSupplies();
          },
          error: (error) => {
            console.error('Erro ao excluir abastecimento:', error);
            this.snackBar.open('Erro ao excluir abastecimento', 'Fechar', { duration: 3000 });
          }        
        });
      }
    });
  }
  updateFuelSupply(fuelSupply: FuelSupply) {
    const dialogRef = this.dialog.open(FormAddFuelSupplier, {
      width: '500px',
      data: fuelSupply,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fuelSupplyService.updateFuelSupply(fuelSupply.id, result).subscribe({
          next: (fuelSupply) => {
            this.snackBar.open('Abastecimento atualizado com sucesso', 'Fechar', { duration: 3000 });
            this.getFuelSupplies();
          },
          error: (error) => {
            console.error('Erro ao atualizar abastecimento:', error);
            this.snackBar.open('Erro ao atualizar abastecimento', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getFuelSupplies() {
    this.isLoading.set(true);
    this.fuelSupplyService.getAllFuelSupplies().subscribe({
      next: (fuelSupplies) => {
        this.dataSource.data = fuelSupplies;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar abastecimentos:', error);
        this.isLoading.set(false);
      }
    });
  }
}
