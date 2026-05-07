import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../../services/report-service';

@Component({
  selector: 'app-report-preview-component',
  imports: [],
  templateUrl: './report-preview-component.html',
  styleUrl: './report-preview-component.scss',
})
export class ReportPreviewComponent implements OnInit {
  idRelatorio: string | null = null;
  filtros: any = {};

  constructor(private route: ActivatedRoute, private relatorioService: ReportService) {}

  ngOnInit() {
    // 1. Captura o ID da URL (ex: 'cons_veiculo')
    this.idRelatorio = this.route.snapshot.paramMap.get('id');

    // 2. Captura os Filtros (queryParams)
    this.route.queryParams.subscribe(params => {
      this.filtros = params;
      console.log(this.filtros, 'FILTROS');
      this.carregarDados();
    });
  }

  carregarDados() {
    // Agora chama o Laravel passando tudo
    this.relatorioService.getDados(this.idRelatorio!, this.filtros).subscribe(res => {
       // Alimenta a tabela em tela...
    });
  }
}
