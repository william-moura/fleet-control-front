import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PrefeituraService } from '../../services/prefeitura-service';
import { Prefeitura } from '../../models/prefeitura';
import { Orgao } from '../../models/orgao';
import { NgxMaskDirective } from 'ngx-mask';
import { AsyncSelect } from '../../components/async-select/async-select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-update-secretaria',
  imports: [CommonModule,
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
    NgxMaskDirective,AsyncSelect, MatProgressSpinnerModule],
  templateUrl: './add-update-secretaria.html',
  styleUrl: './add-update-secretaria.scss',
})
export class AddUpdateSecretaria {
  private fb = inject(FormBuilder);
  form: FormGroup;
  private router = inject(Router);
  private prefeituraService = inject(PrefeituraService);  
  prefeituras$ = signal<Observable<Prefeitura[]>>(of([]));
  orgaos$ = signal<Observable<Orgao[]>>(of([]));
  constructor(private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      nome: ['', Validators.required],
      responsavel: ['', Validators.required],
      email: ['', Validators.required],
      prefeituraId: ['', Validators.required],
      orgaoId: ['', Validators.required],
    });
  }
  cancelar() {
    this.router.navigate(['/secretarias']);
  }
  salvar() {
    console.log(this.form.value);
  }
  getPrefeituras() {
    this.prefeituraService.getPrefeituras(0, 1000).subscribe((prefeituras) => {
      this.prefeituras$.set(of(prefeituras.data));
      this.cdr.detectChanges();
    });
  }
  getOrgaos() {
    this.prefeituraService.getOrgaos(0, 1000).subscribe((orgaos) => {
      this.orgaos$.set(of(orgaos.data));
      this.cdr.detectChanges();
    });
  }
}
