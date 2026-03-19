import { Component, inject, signal, viewChild, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle-service';
import { FormAddVehicle } from '../form-add-vehicle/form-add-vehicle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-vehicles',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
})
export class Vehicles {
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  // constructor(private paginator: MatPaginator) {
  //   this.paginator = paginator;
  // }
  isLoading = signal(true);
  displayedColumns: string[] = ['vehicle_plate', 'vehicle_brand', 'vehicle_model', 'vehicle_year', 'vehicle_fuel_type', 'vehicle_fuel_capacity', 'vehicle_current_mileage', 'vehicle_purchase_date', 'vehicle_notes', 'vehicle_status', 'acoes'];
  dataSource = new MatTableDataSource<Vehicle>([]);
  // paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getVehicles() {
    this.isLoading.set(true);
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.dataSource.data = vehicles;
        this.dataSource.paginator = this.paginator;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar veículos:', error);
        this.isLoading.set(false);
      }
    });
  }
  ngOnInit() {
    this.getVehicles();
  }
  openAddVehicleDialog() {
    const dialogRef = this.dialog.open(FormAddVehicle, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result.vehiclePurchaseDate.toISOString().split('T')[0], 'result');
        result.vehiclePurchaseDate = result.vehiclePurchaseDate.toISOString().split('T')[0];
        this.vehicleService.createVehicle(result).subscribe({
          next: (vehicle) => {
            this.snackBar.open('Veículo cadastrado com sucesso', 'Fechar', { duration: 3000 });
            this.getVehicles();
          },
          error: (error) => {
            console.error('Erro ao cadastrar veículo:', error);
            this.snackBar.open('Erro ao cadastrar veículo', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  async deleteVehicle(vehicle: Vehicle) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Veículo',
        message: 'Tem certeza que deseja excluir este veículo?',
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      try {
        this.isLoading.set(true);
        await firstValueFrom(this.vehicleService.deleteVehicle(vehicle.id));
        this.snackBar.open('Veículo excluído com sucesso', 'Fechar', { duration: 3000 });
        this.getVehicles();
        this.isLoading.set(false);
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        this.snackBar.open('Erro ao excluir veículo', 'Fechar', { duration: 3000 });
        this.isLoading.set(false);
      }
    }
  }
}
