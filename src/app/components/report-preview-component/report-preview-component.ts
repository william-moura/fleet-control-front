import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report-service';
import { Component, viewChild, AfterViewInit, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card'
import { DriverService } from '../../services/driver-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Driver } from '../../models/driver';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { FormAddDriver } from '../../forms/form-add-driver/form-add-driver';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-report-preview-component',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, 
    MatSortModule, MatInputModule, MatFormFieldModule, 
    MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  templateUrl: './report-preview-component.html',
  styleUrl: './report-preview-component.scss',
})
export class ReportPreviewComponent implements OnInit {
  idRelatorio: string | null = null;
  filtros: any = {};
  dadosPreview: any = [];
  colunasExibidas = signal<string[]>([]);
  dataSource = new MatTableDataSource<any>([]);
  isLoading = signal<boolean>(true);
  headers: any = [];
  titleReport = signal<string>('');
  constructor(private route: ActivatedRoute, private relatorioService: ReportService) {}

  ngOnInit() {
    // 1. Captura o ID da URL (ex: 'cons_veiculo')
    this.idRelatorio = this.route.snapshot.paramMap.get('id');

    // 2. Captura os Filtros (queryParams)
    this.route.queryParams.subscribe(params => {
      this.filtros = params;      
      this.carregarDados();
    });
  }

  carregarDados() {
    // Agora chama o Laravel passando tudo
    this.relatorioService.getDados(this.idRelatorio!, this.filtros).subscribe(res => {      
      this.headers = res.columns;      
      this.dataSource.data = res.data;
      this.colunasExibidas.set(Object.keys(this.headers));
      this.titleReport.set(res.title);
      this.isLoading.set(false);
    });
  }
  exportarPDF() {
    console.log('PDF');
    const queryParams = new URLSearchParams(this.filtros).toString();
    const url = `${environment.apiUrl}/reports/${this.idRelatorio}/pdf?${queryParams}`;
    window.open(url, '_blank');    
  }
  exportarExcel() {    
    const queryParams = new URLSearchParams(this.filtros).toString();
    const url = `${environment.apiUrl}/reports/${this.idRelatorio}/excel?${queryParams}`;
    window.open(url, '_blank');
  }
}
