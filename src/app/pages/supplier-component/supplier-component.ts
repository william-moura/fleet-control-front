import { Component, viewChild, AfterViewInit, inject, signal } from '@angular/core';
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
import { Supplier } from '../../models/supplier';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { SupplierService } from '../../services/supplier-service';
import { FormAddSupplier } from '../../forms/form-add-supplier/form-add-supplier';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { Router } from '@angular/router';
import { NewWindow } from '../../directives/new-window';

@Component({
  selector: 'app-supplier-component',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, NewWindow],
  templateUrl: './supplier-component.html',
  styleUrl: './supplier-component.scss',
})
export class SupplierComponent {
  private supplierService = inject(SupplierService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['supplierFantasyName', 'supplierCorporateName', 'supplierCnpj', 'supplierAddress', 'supplierCity', 'supplierState', 'supplierStatus', 'acoes'];
  dataSource = new MatTableDataSource<Supplier>([]);
  paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private supplierStateService = inject(VehicleStateService);
  private router = inject(Router);
  ngAfterViewInit() {    
    this.dataSource.sort = this.sort();
  }
  getSuppliers() {
    this.isLoading.set(true);
    this.supplierService.getAllSuppliers(undefined, this.indicePagina, this.pageSize).subscribe({
      next: (suppliers) => {
        this.dataSource.data = suppliers.data;
        this.totalRegistros = suppliers.total;
        this.indicePagina = suppliers.current_page - 1;
        // this.dataSource.paginator = this.paginator;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar fornecedores:', error);
        this.isLoading.set(false);
      }
    });
  }
  ngOnInit() {
    this.getSuppliers();
  }
  async openAddSupplierDialog() {
    this.supplierStateService.setSupplier(null);
    this.router.navigate(['/supplier/new']);
  }
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async deleteSupplier(supplier: Supplier) {
    const result = await firstValueFrom(this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Excluir Fornecedor',
        message: `Tem certeza que deseja excluir o fornecedor ${supplier.supplierFantasyName}?`,
      },
    }).afterClosed());
    if (result) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.snackBar.open('Fornecedor excluído com sucesso', 'Fechar', { duration: 3000 });
          this.getSuppliers();
        },
        error: (error) => {
          console.error('Erro ao excluir fornecedor:', error);
          this.snackBar.open('Erro ao excluir fornecedor, ' + error.error.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  async updateSupplier(supplier: Supplier) {
    this.supplierStateService.setSupplier(supplier);
    this.router.navigate(['/supplier/edit']);
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSuppliers();
  }
}
