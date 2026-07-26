import { Component, inject, signal, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { Secretaria } from '../../models/secretaria';
import { PrefeituraService } from '../../services/prefeitura-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { NewWindow } from '../../directives/new-window';

@Component({
  selector: 'app-secretarias',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule, CommonModule, NewWindow],
  templateUrl: './secretarias.html',
  styleUrl: './secretarias.scss',
})
export class Secretarias {

  displayedColumns: string[] = ['nome', 'sigla', 'acoes'];
  dataSource = new MatTableDataSource<Secretaria>([]);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  secretarias = signal<Secretaria[]>([]);
  private prefeituraService = inject(PrefeituraService);
  private router = inject(Router);
  private vehicleStateService = inject(VehicleStateService);

  ngOnInit() {
    this.prefeituraService.getSecretarias(this.indicePagina, this.pageSize).subscribe((secretarias) => {
      this.dataSource.data = secretarias.data;
      this.totalRegistros = secretarias.total;
      this.indicePagina = secretarias.current_page - 1;
      this.pageSize = secretarias.per_page;
      this.isLoading.set(false);
    });
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.prefeituraService.getSecretarias(this.indicePagina, this.pageSize).subscribe((secretarias) => {
      this.dataSource.data = secretarias.data;
      this.totalRegistros = secretarias.total;
      this.indicePagina = secretarias.current_page - 1;
      this.pageSize = secretarias.per_page;
      this.isLoading.set(false);
    });
  }
  async deleteSecretaria(secretaria: Secretaria) {
    const confirm = await this.dialog.open(ConfirmDialog, {
      data: {
        titulo: 'Excluir Secretaria',
        mensagem: 'Tem certeza que deseja excluir a secretaria?',
      },
    });
    const result = await firstValueFrom(confirm.afterClosed());
    if (result) {
      this.prefeituraService.deleteSecretaria(Number(secretaria.id)).subscribe({
        next: () => {
          this.getSecretarias();
          this.snackBar.open('Secretaria excluída com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Erro ao excluir secretaria:', error);
          this.snackBar.open('Erro ao excluir secretaria', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  private getSecretarias() {
    this.prefeituraService.getSecretarias(this.indicePagina, this.pageSize).subscribe((secretarias) => {
      this.dataSource.data = secretarias.data;
      this.totalRegistros = secretarias.total;
      this.indicePagina = secretarias.current_page - 1;
      this.pageSize = secretarias.per_page;
      this.isLoading.set(false);
    });
  }
  async updateSecretaria(secretaria: Secretaria) {
    this.vehicleStateService.setSecretaria(secretaria);
    this.router.navigate(['/secretaria/edit']);
  }
  openAddSecretariaDialog() {
    this.vehicleStateService.setSecretaria(null);
    this.router.navigate(['/secretaria/new']);
  }
}