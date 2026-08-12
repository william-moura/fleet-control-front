import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrefeituraService } from '../../services/prefeitura-service';
import { Observable, of } from 'rxjs';
import { Prefeitura } from '../../models/prefeitura';
import { NgxMaskDirective } from 'ngx-mask';
import { AsyncSelect } from '../../components/async-select/async-select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Orgao } from '../../models/orgao';
@Component({
  selector: 'app-add-update-orgao',
  imports: [CommonModule, ReactiveFormsModule,
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
  templateUrl: './add-update-orgao.html',
  styleUrl: './add-update-orgao.scss',
})
export class AddUpdateOrgao {
  private fb = inject(FormBuilder);
  form: FormGroup;
  private router = inject(Router);
  private prefeituraService = inject(PrefeituraService);
  prefeituras$ = signal<Observable<Prefeitura[]>>(of([]));
  isLoading = signal(false);
  private snackBar = inject(MatSnackBar);
  orgao = signal<Orgao | null>(null);
  private route = inject(ActivatedRoute);
  update = signal<boolean>(false);
  
  constructor(private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      nome: ['', Validators.required],
      sigla: ['', Validators.required],
      prefeituraId: ['', Validators.required],
    });
  }
  cancelar() {
    this.router.navigate(['/orgaos']);
  }
  salvar() {
    if (this.form.get('nome')?.getError('required')) {
      this.form.get('nome')?.setErrors({required: true});
      this.snackBar.open('O campo Nome é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('sigla')?.getError('required')) {
      this.form.get('sigla')?.setErrors({required: true});
      this.snackBar.open('O campo Sigla é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('prefeituraId')?.getError('required')) {
      this.form.get('prefeituraId')?.setErrors({required: true});
      this.snackBar.open('O campo Prefeitura é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.valid) {
      if (this.update()) {
        this.updateOrgao();
      } else {
        this.createOrgao();
      }      
    }    
  }
  getPrefeituras() {
    this.prefeituraService.getPrefeituras(0, 1000).subscribe((prefeituras) => {
      this.prefeituras$.set(of(prefeituras.data));
      this.cdr.detectChanges();
    });
  }
  onPrefeituraChange(event: any) {
    console.log(event);
  }
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.update.set(true);
      this.getPrefeituras();
      this.prefeituraService.getOrgaoById(id).subscribe((orgao) => {
        this.orgao.set(orgao);
        this.form.patchValue(orgao);
      });
    } else {
      this.update.set(false);
      this.prefeituraService.getNextRegistrationNumberOrgao().subscribe((nextRegistrationNumber) => {
        this.form.patchValue({
          id: Number(nextRegistrationNumber),
        });
      });
    }
  }
  private createOrgao() {
    this.prefeituraService.createOrgao(this.form.value).subscribe({
      next: (orgao) => {
        this.orgao.set(orgao);
        this.snackBar.open('Órgão criado com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/orgaos']);
      
      },
      error: (error) => {
        console.error('Erro ao criar órgão:', error);
        this.snackBar.open('Erro ao criar órgão ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateOrgao() {
    const id = this.orgao()?.id;
    if (id) {
      this.prefeituraService.updateOrgao(this.form.value, Number(id)).subscribe({
        next: (orgao) => {
          this.orgao.set(orgao);
          this.snackBar.open('Órgão atualizado com sucesso', 'Fechar', { duration: 3000 });
          this.router.navigate(['/orgaos']);
        },
        error: (error) => {
          console.error('Erro ao atualizar órgão:', error);
          this.snackBar.open('Erro ao atualizar órgão ' + error.error?.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
