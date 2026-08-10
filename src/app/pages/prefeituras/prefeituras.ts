import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NewWindow } from '../../directives/new-window';
import { Prefeitura } from '../../models/prefeitura';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PrefeituraService } from '../../services/prefeitura-service';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { VehicleStateService } from '../../services/vehicle-state-service';

@Component({
  selector: 'app-prefeituras',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule, CommonModule, NewWindow],
  templateUrl: './prefeituras.html',
  styleUrl: './prefeituras.scss',
})
export class Prefeituras {
  displayedColumns: string[] = ['nome', 'uf', 'cnpj', 'acoes'];
  dataSource = new MatTableDataSource<Prefeitura>([]);
  // paginator = viewChild.required(MatPaginator);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  prefeituras = signal<Prefeitura[]>([]);  
  private prefeituraService = inject(PrefeituraService);
  private router = inject(Router);
  private vehicleStateService = inject(VehicleStateService);
  ngOnInit() {
    this.prefeituraService.getPrefeituras(this.indicePagina, this.pageSize).subscribe((prefeituras) => {
      this.dataSource.data = prefeituras.data;
      this.totalRegistros = prefeituras.total;
      this.indicePagina = prefeituras.current_page - 1;
      this.pageSize = prefeituras.per_page;
      this.isLoading.set(false);
    });
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.prefeituraService.getPrefeituras(this.indicePagina, this.pageSize).subscribe((prefeituras) => {
      this.dataSource.data = prefeituras.data;
      this.totalRegistros = prefeituras.total;
      this.indicePagina = prefeituras.current_page - 1;
      this.pageSize = prefeituras.per_page;
      this.isLoading.set(false);
    });
  }
  async deletePrefeitura(prefeitura: Prefeitura) {
    const confirm = await this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Excluir Prefeitura',
        message: 'Tem certeza que deseja excluir a prefeitura?',
      },
    });
    const result = await firstValueFrom(confirm.afterClosed());
    if (result) {
      this.prefeituraService.deletePrefeitura(Number(prefeitura.id)).subscribe({
        next: () => {
          this.getPrefeituras();
          this.snackBar.open('Prefeitura excluída com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Erro ao excluir prefeitura:', error);
          this.snackBar.open('Erro ao excluir prefeitura', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  private getPrefeituras() {
    this.prefeituraService.getPrefeituras(this.indicePagina, this.pageSize).subscribe((prefeituras) => {
      this.dataSource.data = prefeituras.data;
      this.totalRegistros = prefeituras.total;
      this.indicePagina = prefeituras.current_page - 1;
      this.pageSize = prefeituras.per_page;
      this.isLoading.set(false);
    });
  }

  async updatePrefeitura(prefeitura: Prefeitura) {
    this.vehicleStateService.setPrefeitura(prefeitura);
    this.router.navigate(['/prefeitura/edit', prefeitura.id]);
  }
  openAddPrefeituraDialog() {
    this.vehicleStateService.setPrefeitura(null);
    this.router.navigate(['/prefeitura/new']);
  }
}
