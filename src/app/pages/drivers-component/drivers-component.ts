import { Component, viewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { Router } from '@angular/router';
import { VehicleStateService } from '../../services/vehicle-state-service';

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
  private router = inject(Router);
  private driverStateService = inject(VehicleStateService);
  // Fonte de dados usando Signals para reatividade básica
  dataSource = new MatTableDataSource<Driver>([]);

  // Queries para os componentes de paginação e ordenação
  //paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;

  constructor() {}

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator();
    this.dataSource.sort = this.sort();
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getDrivers() {
    this.driverService.getAllDrivers(this.indicePagina, this.pageSize).subscribe((drivers) => {
      this.dataSource.data = drivers.data;
      this.totalRegistros = drivers.total;
      this.indicePagina = drivers.current_page - 1;
      this.pageSize = drivers.per_page;
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
    this.driverStateService.setDriver(null);
    this.router.navigate(['/driver/new']);
  }
  async updateDriver(driver: Driver) {
    this.driverStateService.setDriver(driver);
    this.router.navigate(['/driver/edit']);
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDrivers();
  }

  abrirNovaInstancia() {
    // this.clearForm();
    // this.router.navigate(['/vehicles/new']);
    const largura = Math.round(screen.width * 0.9);
    const altura = Math.round(screen.height * 0.9);
    const urlDaSpa = window.location.origin; 
    const configuracoesJanela = `width=${largura},height=${altura},menubar=yes,toolbar=yes,location=yes,status=yes`;
    const url = `${urlDaSpa}/vehicle-fines`;    
    window.open(url, '_blank', configuracoesJanela);
  }
}
