import { Component, signal, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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
  displayedColumns: string[] = ['nome', 'cnh', 'categoria', 'status', 'acoes'];
  
  // Fonte de dados usando Signals para reatividade básica
  dataSource = new MatTableDataSource<Motorista>(DADOS_MOCK);

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

