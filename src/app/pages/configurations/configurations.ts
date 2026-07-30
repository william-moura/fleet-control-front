import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective } from 'ngx-mask';
import { DragDropDirective } from '../../drag-drop-directive';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration-service';
import { AlertSettings, Configuration } from '../../models/configuration';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-configurations',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    FormsModule
  ],
  templateUrl: './configurations.html',
  styleUrl: './configurations.scss',
})
export class Configurations {
  private snackBar = inject(MatSnackBar);
  configuracaoPadrao: Configuration = {
    alerts: [],
  };
  cnh: AlertSettings = {
    daysBefore: null,
    alertType: 'cnh',
  };
  manutencao: AlertSettings = {
    daysBefore: null,
    alertType: 'manutencao',
  };
  kmManutencao: AlertSettings = {
    daysBefore: null,
    alertType: 'kmManutencao',
  }
  multas: AlertSettings = {
    daysBefore: null,
    alertType: 'multas',
  }
  isLoading = signal<boolean>(false);
  constructor(private router: Router, private configurationService: ConfigurationService, private cdr: ChangeDetectorRef) {
    this.manutencao.daysBefore = 0;
    this.kmManutencao.daysBefore = 0;
    this.multas.daysBefore = 0;
    this.cnh.daysBefore = 0;
  }
  ngOnInit() {
    this.isLoading.set(true);
    const configuration = this.configurationService.getConfiguration();
    configuration.subscribe((response: Configuration) => {
      response.alerts.forEach((alert: AlertSettings) => {
        switch (alert.alertType) {
          case 'cnh':
            this.cnh = alert;
            break;
          case 'manutencao':
            this.manutencao = alert;
            break;
          case 'kmManutencao':
            this.kmManutencao = alert;
            break;
          case 'multas':
            this.multas = alert;
            break;
        }
      });
      this.cdr.detectChanges();
      this.isLoading.set(false);
    });
  }
  salvar() {    
    this.isLoading.set(true);
    this.configuracaoPadrao.alerts.push(this.cnh);
    this.configuracaoPadrao.alerts.push(this.manutencao);
    this.configuracaoPadrao.alerts.push(this.kmManutencao);
    this.configuracaoPadrao.alerts.push(this.multas);
    console.log(this.configuracaoPadrao, 'hahaha');
    this.configurationService.createConfiguration(this.configuracaoPadrao).subscribe({
      next: (response) => {
        this.snackBar.open('Configurações salvas com sucesso', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erro ao salvar configurações', 'Fechar', { duration: 3000 });
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
  atualizarValor(valor: any) {
    if (!valor) {
      this.kmManutencao.daysBefore = 0;
      return;
    }
  
    // Converte para string e remove qualquer caractere que não seja número
    let valorLimpo = valor.toString().replace(/\D/g, '');
  
    // Se o valor for muito curto, preenche com zeros à esquerda (ex: "5" vira "005")
    valorLimpo = valorLimpo.padStart(3, '0');
  
    // Insere o ponto decimal antes dos últimos 2 dígitos (ex: "12345" vira "123.45")
    const parteInteira = valorLimpo.slice(0, -2);
    const parteDecimal = valorLimpo.slice(-2);
    
    this.kmManutencao.daysBefore = parseFloat(`${parteInteira}.${parteDecimal}`);
  }
  inputTransform(value: any): string | number {
    if (value === null || value === undefined) return '';
    return value.toString().replace('.', ',');
  }
  
  // Transforma o texto digitado em um número decimal real para o seu model
  outputTransform(value: any): any {
    if (!value) return 0;
    // Remove pontos de milhar e converte a vírgula em ponto numérico
    const valorLimpo = value.toString().replace(/\./g, '').replace(',', '.');
    return parseFloat(valorLimpo) || 0;
  }
}
