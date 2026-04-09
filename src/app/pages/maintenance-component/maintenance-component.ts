import { Component, viewChild, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MaintenanceService } from '../../services/maintenance-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Supplier } from '../../models/supplier';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { SupplierService } from '../../services/supplier-service';
import { FormAddSupplier } from '../form-add-supplier/form-add-supplier';
import { Maintenance } from '../../models/maintenance';
import { FormAddMaintenance } from '../form-add-maintenance/form-add-maintenance';
import { FormAddMaintenanceService } from '../form-add-maintenance-service/form-add-maintenance-service';

@Component({
  selector: 'app-maintenance-component',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './maintenance-component.html',
  styleUrl: './maintenance-component.scss',
})
export class MaintenanceComponent {
  displayedColumns: string[] = [
    'vehicle', 'maintenance_type', 'description', 'maintenance_date', 'maintenance_cost', 'next_maintenance_date',
    'kilometers', 'supplier_name',
    'acoes'];
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private maintenanceService = inject(MaintenanceService);
  dataSource = new MatTableDataSource<Maintenance>([]);
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  async deleteMaintenance(maintenance: Maintenance) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Manutenção',
        message: 'Tem certeza que deseja excluir esta manutenção?',
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.maintenanceService.deleteMaintenance(maintenance.id).subscribe(() => {
        this.snackBar.open('Manutenção excluída com sucesso', 'Fechar', { duration: 3000 });
        this.getAllMaintenances();
      });
    }
  }
  getAllMaintenances() {
    this.maintenanceService.getAllMaintenances().subscribe((maintenances) => {
      maintenances.forEach(maintenance => {
        maintenance.servicesFormatted = maintenance.services?.
        map(service => service.maintenance_control_service_name).join(', ');
      });
      this.dataSource.data = maintenances;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.getAllMaintenances();
  }

  async openAddMaintenanceDialog() {
    const dialogRef = this.dialog.open(FormAddMaintenance, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.maintenanceService.createMaintenance(result).subscribe({
          next: (maintenance) => {
            this.snackBar.open('Manutenção cadastrada com sucesso', 'Fechar', { duration: 3000 });
            this.getAllMaintenances();
          },
          error: (error) => {
            console.error('Erro ao cadastrar fornecedor:', error);
            this.snackBar.open('Erro ao cadastrar fornecedor', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  async updateMaintenance(maintenance: Maintenance) {
    console.log(maintenance,'maintenance');
    const result = await firstValueFrom(this.dialog.open(FormAddMaintenance, {
      width: '600px',
      data: maintenance,
    }).afterClosed());
    if (result) {
      this.maintenanceService.updateMaintenance(maintenance.id, result).subscribe(() => {
        this.snackBar.open('Manutenção atualizada com sucesso', 'Fechar', { duration: 3000 });
        this.getAllMaintenances();
      });
    }
  }
  async openAddMaintenanceServiceDialog() {
    const dialogRef = this.dialog.open(FormAddMaintenanceService, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.maintenanceService.createMaintenanceService(result).subscribe(() => {
          this.snackBar.open('Serviço de manutenção cadastrado com sucesso', 'Fechar', { duration: 3000 });
          this.getAllMaintenances();
        });
      }
    });
  }
}
