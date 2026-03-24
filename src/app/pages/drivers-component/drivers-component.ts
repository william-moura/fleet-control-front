import { Component, signal, viewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DriverService } from '../../services/driver-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Driver } from '../../models/driver';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { FormAddDriver } from '../form-add-driver/form-add-driver';

export interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  categoria: 'A' | 'B' | 'AB' | 'D' | 'E';
  status: 'Ativo' | 'Inativo';
  ultimoAcesso: Date;
}

@Component({
  selector: 'app-drivers-component',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule
  ],
  standalone: true,
  templateUrl: './drivers-component.html',
  styleUrl: './drivers-component.scss',
})
export class DriversComponent implements AfterViewInit {
  private driverService = inject(DriverService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['nome', 'driverRegisteredNumber', 'cnh', 'categoria', 'status', 'acoes'];
  
  // Fonte de dados usando Signals para reatividade básica
  dataSource = new MatTableDataSource<Driver>([]);

  // Queries para os componentes de paginação e ordenação
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getDrivers() {
    this.driverService.getAllDrivers().subscribe((drivers) => {
      this.dataSource.data = drivers;
    });
  }
  async deleteDriver(driver: Driver) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Motorista',
        message: 'Tem certeza que deseja excluir este motorista?',
      },
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      try {        
        await firstValueFrom(this.driverService.deleteDriver(driver.id));
        this.snackBar.open('Motorista excluído com sucesso', 'Fechar', { duration: 3000 });
      } catch (error) {
        console.error('Erro ao excluir motorista:', error);
        this.snackBar.open('Erro ao excluir motorista', 'Fechar', { duration: 3000 });
      }
      finally {        
        this.getDrivers();
      }
    }
  }
  ngOnInit() {
    this.getDrivers();
  }
  openAddDriverDialog() {
    const dialogRef = this.dialog.open(FormAddDriver, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //result.vehiclePurchaseDate = result.vehiclePurchaseDate.toISOString().split('T')[0];
        result.driverLicenseExpirationDate = result.driverLicenseExpirationDate.toISOString().split('T')[0];
        result.driverBirthDate = result.driverBirthDate.toISOString().split('T')[0];        
        this.driverService.createDriver(result).subscribe({
          next: (driver) => {
            this.snackBar.open('Motorista cadastrado com sucesso', 'Fechar', { duration: 3000 });
            this.getDrivers();
          },
          error: (error) => {
            console.error('Erro ao cadastrar motorista:', error);
            this.snackBar.open('Erro ao cadastrar motorista', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
  async updateDriver(driver: Driver) {
    const dialogRef = this.dialog.open(FormAddDriver, {
      width: '600px',
      disableClose: true,
      data: driver,
    });
    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      try {
        await firstValueFrom(this.driverService.updateDriver(driver.id, result));
        this.snackBar.open('Motorista atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.getDrivers();
      } catch (error) {
        console.error('Erro ao atualizar motorista:', error);
        this.snackBar.open('Erro ao atualizar motorista', 'Fechar', { duration: 3000 });
      }
    }
  }
}

// Dados de exemplo
const DADOS_MOCK: Motorista[] = [
  { id: 1, nome: 'Ayrton Senna', cnh: '123456789', categoria: 'E', status: 'Ativo', ultimoAcesso: new Date() },
  { id: 2, nome: 'Lewis Hamilton', cnh: '987654321', categoria: 'B', status: 'Ativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Max Verstappen', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Lando Norris', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Charles Leclerc', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Carlos Sainz', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'George Russell', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Fernando Alonso', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Pierre Gasly', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Esteban Ocon', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
  { id: 3, nome: 'Lance Stroll', cnh: '456123789', categoria: 'AB', status: 'Inativo', ultimoAcesso: new Date() },
];

