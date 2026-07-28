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
import { Orgao } from '../../models/orgao';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrefeituraService } from '../../services/prefeitura-service';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { NewWindow } from '../../directives/new-window';
@Component({
  selector: 'app-orgaos',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatButtonModule, 
    MatIconModule, MatChipsModule, MatPaginatorModule, CommonModule, NewWindow],
  templateUrl: './orgaos.html',
  styleUrl: './orgaos.scss',
})
export class Orgaos {

  displayedColumns: string[] = ['nome', 'sigla', 'acoes'];
  dataSource = new MatTableDataSource<Orgao>([]);
  sort = viewChild.required(MatSort);
  isLoading = signal(true);
  totalRegistros = 0;
  pageSize = 5;
  indicePagina = 0;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  orgaos = signal<Orgao[]>([]);
  private prefeituraService = inject(PrefeituraService);
  private vehicleStateService = inject(VehicleStateService);
  private router = inject(Router);
  ngOnInit() {
    this.prefeituraService.getOrgaos(this.indicePagina, this.pageSize).subscribe((orgaos) => {
      this.dataSource.data = orgaos.data;
      this.totalRegistros = orgaos.total;
      this.indicePagina = orgaos.current_page - 1;
      this.pageSize = orgaos.per_page;
      this.isLoading.set(false);
    });
  }
  onPageChange(event: PageEvent) {
    this.indicePagina = event.pageIndex;
    this.pageSize = event.pageSize;
    this.prefeituraService.getOrgaos(this.indicePagina, this.pageSize).subscribe((orgaos) => {
      this.dataSource.data = orgaos.data;
      this.totalRegistros = orgaos.total;
      this.indicePagina = orgaos.current_page - 1;
      this.pageSize = orgaos.per_page;
      this.isLoading.set(false);
    });
  }
  async deleteOrgao(orgao: Orgao) {
    const confirm = await this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Excluir Órgão',
        message: 'Tem certeza que deseja excluir o órgão?',
      },
    });
    const result = await firstValueFrom(confirm.afterClosed());
    if (result) {
      this.prefeituraService.deleteOrgao(Number(orgao.id)).subscribe({
        next: () => {
          this.getOrgaos();
          this.snackBar.open('Órgão excluído com sucesso', 'Fechar', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('Erro ao excluir órgão:', error);
          this.snackBar.open('Erro ao excluir órgão', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  private getOrgaos() {
    this.prefeituraService.getOrgaos(this.indicePagina, this.pageSize).subscribe((orgaos) => {
      this.dataSource.data = orgaos.data;
      this.totalRegistros = orgaos.total;
      this.indicePagina = orgaos.current_page - 1;
      this.pageSize = orgaos.per_page;
      this.isLoading.set(false);
    });
  }
  async updateOrgao(orgao: Orgao) {
    this.vehicleStateService.setOrgao(orgao);
    this.router.navigate(['/orgao/edit']);
  }
  openAddOrgaoDialog() {
    this.vehicleStateService.setOrgao(null);
    this.router.navigate(['/orgao/new']);
  }
}
