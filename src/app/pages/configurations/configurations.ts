import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    DragDropDirective,
    FormsModule
  ],
  templateUrl: './configurations.html',
  styleUrl: './configurations.scss',
})
export class Configurations {
  alertTypes: any[] = [];
  manutencaoDaysBefore: number = 0;
  kmManutencao: number = 0;
  cnhDaysBefore: number = 0;
  configuracaoPadrao = {
    cnh: {
      daysBefore: 0,
      alertType: 'cnh',
    },
    manutencao: {
      daysBefore: 0,
      alertType: 'manutencao',
    },
    kmManutencao: {
      daysBefore: 0,
      alertType: 'kmManutencao',
    },
    multas: {
      daysBefore: 0,
      alertType: 'multas',
    },
  };
  configuracao: any = {};
  constructor(private router: Router, private http: HttpClient) {}
  cancelar() {
    this.router.navigate(['/dashboard']);
  }
  salvar() {    
    this.alertTypes.push(this.configuracaoPadrao.cnh);
    this.alertTypes.push(this.configuracaoPadrao.manutencao);
    this.alertTypes.push(this.configuracaoPadrao.kmManutencao);
    const alerts = { alerts: this.alertTypes };
    
    this.http.post('http://localhost:8080/api/alert-settings', alerts).subscribe((response) => {      
      this.router.navigate(['/dashboard']);
    });
  }
}
