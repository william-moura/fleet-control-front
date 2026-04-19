import { Component, inject, signal, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service'; // Criaremos este serviço
import { Dashboard } from '../../models/dashboard';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
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
