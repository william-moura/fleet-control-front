import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Secretaria } from '../../models/secretaria';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  update = signal<boolean>(false);
  private route = inject(ActivatedRoute);
  secretaria = signal<Secretaria | null>(null);
  private snackBar = inject(MatSnackBar);
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
    if (this.form.get('nome')?.getError('required')) {
      this.form.get('nome')?.setErrors({required: true});
      this.snackBar.open('O nome da secretaria é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('responsavel')?.getError('required')) {
      this.form.get('responsavel')?.setErrors({required: true});
      this.snackBar.open('O responsável é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('email')?.getError('required')) {
      this.form.get('email')?.setErrors({required: true});
      this.snackBar.open('O email é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('prefeituraId')?.getError('required')) {
      this.form.get('prefeituraId')?.setErrors({required: true});
      this.snackBar.open('A prefeitura é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('orgaoId')?.getError('required')) {
      this.form.get('orgaoId')?.setErrors({required: true});
      this.snackBar.open('O órgão é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.valid) {
      if (this.update()) {
        this.updateSecretaria();
      } else {
        this.createSecretaria();
      }
    }
  }
  getPrefeituras() {
    this.prefeituraService.getPrefeituras(0, 1000).subscribe((prefeituras) => {
      this.prefeituras$.set(of(prefeituras.data));
      this.cdr.detectChanges();
    });
  }
  getOrgaos() {
    this.prefeituraService.getOrgaosByPrefeituraId(this.form.get('prefeituraId')?.value).subscribe((orgaos) => {
      this.orgaos$.set(of(orgaos));
      this.cdr.detectChanges();
    });
  }
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.update.set(true);
      this.getPrefeituras();
      this.prefeituraService.getSecretariaById(id).subscribe((secretaria) => {
        this.secretaria.set(secretaria);
        this.form.patchValue(secretaria);
        this.getOrgaos();
      });
    } else {
      this.update.set(false);
      this.prefeituraService.getNextRegistrationNumberSecretaria().subscribe((nextRegistrationNumber) => {
        this.form.patchValue({
          id: Number(nextRegistrationNumber),
        });
      });
    }
  }
  private createSecretaria() {
    this.prefeituraService.createSecretaria(this.form.value).subscribe({
      next: (secretaria) => {
        this.secretaria.set(secretaria);
        this.snackBar.open('Secretaria criada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/secretarias']);
      },
      error: (error) => {
        console.error('Erro ao criar secretaria:', error);
        this.snackBar.open('Erro ao criar secretaria ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateSecretaria() {
    const id = this.secretaria()?.id;
    if (id) {
      this.prefeituraService.updateSecretaria(this.form.value, Number(id)).subscribe({
        next: (secretaria) => {
          this.secretaria.set(secretaria);
          this.snackBar.open('Secretaria atualizada com sucesso', 'Fechar', { duration: 3000 });
          this.clearForm();
          this.router.navigate(['/secretarias']);
        },
        error: (error) => {
          console.error('Erro ao atualizar secretaria:', error);
          this.snackBar.open('Erro ao atualizar secretaria ' + error.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  private clearForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
