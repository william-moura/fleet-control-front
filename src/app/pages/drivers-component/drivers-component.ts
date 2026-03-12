import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';

export interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  status: 'Ativo' | 'Inativo';
}

@Component({
  selector: 'app-drivers-component',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, 
    MatButtonModule, MatIconModule, MatCardModule, 
    MatInputModule, MatMenuModule, MatSortModule
  ],
  standalone: true,
  templateUrl: './drivers-component.html',
  styleUrl: './drivers-component.scss',
})
export class DriversComponent implements AfterViewInit {
  displayedColumns: string[] = ['nome', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Motorista>([
    { id: 1, nome: 'Ricardo Souza', cnh: '123456789-0', status: 'Ativo' },
    { id: 2, nome: 'Marcos Oliveira', cnh: '987654321-5', status: 'Inativo' },
    { id: 3, nome: 'Ana Beatriz', cnh: '456789123-2', status: 'Ativo' },
  ]);
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {}


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirFormulario() { /* Lógica para abrir modal ou navegar */ }
  editar(m: Motorista) { console.log('Editando', m); }
  deletar(m: Motorista) { console.log('Deletando', m); }
}
