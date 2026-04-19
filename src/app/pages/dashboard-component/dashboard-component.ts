import { Component, inject, signal, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service'; // Criaremos este serviço
import { Dashboard } from '../../models/dashboard';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard-component',
  imports: [DatePipe, CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressBarModule, MatCardModule, 
    MatSnackBarModule, MatProgressSpinnerModule, MatListModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  dashboard = signal<Dashboard | null>(null);
  hoje = new Date();
  
  // Signals para os indicadores
  totalVeiculosAtivos = signal(0);
  consumoMedio = signal(0);
  gastosMensais = signal(0);
  abastecimentosRecentes = signal<any[]>([]);
  manutencoes = signal<any[]>([]);
  ngOnInit() {
    this.dashboardService.getDashboard().subscribe((dashboard) => {
      this.dashboard.set(dashboard);
    });
  }
}
