import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { AsyncSelect } from '../../components/async-select/async-select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PrefeituraService } from '../../services/prefeitura-service';
import { Observable, of } from 'rxjs';
import { Prefeitura } from '../../models/prefeitura';
import { CepService } from '../../services/cep-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-update-prefeitura',
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
  templateUrl: './add-update-prefeitura.html',
  styleUrl: './add-update-prefeitura.scss',
})
export class AddUpdatePrefeitura {
  private fb = inject(FormBuilder);
  form: FormGroup;
  private router = inject(Router);
  private prefeituraService = inject(PrefeituraService);
  prefeituras$ = signal<Observable<Prefeitura[]>>(of([]));
  update = signal<boolean>(false);
  loading = signal<boolean>(false);
  private cepService = inject(CepService);
  private snackBar = inject(MatSnackBar);
  constructor(private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      cnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      uf: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      site: [''],
      foto: [''],
      fotoId: [''],
    });
  }
  cancelar() {
    this.router.navigate(['/prefeituras']);
  }
  salvar() {
    console.log(this.form.value);
    if (this.form.valid) {
      if (this.update() === false) {
        this.create();
      } else {
        this.updatePrefeitura();
      }
    }
  }

  getCep(cep: string) {
    this.loading.set(true);
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        endereco: cep.street,
        cidade: cep.city,
        uf: cep.state,        
        bairro: cep.neighborhood,
      });
      this.loading.set(false);
    }, error => {
      this.loading.set(false);
      this.snackBar.open('Erro ao buscar CEP, verifique se o CEP é válido', 'Fechar', { duration: 3000 });
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.processFiles(files[0]);
    }
  }
  processFiles(files: File) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (files.size > maxSize) {
      this.snackBar.open('Tamanho do arquivo muito grande', 'Fechar', { duration: 3000 });
      return;
    }
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(files.type)) {
      this.snackBar.open('Formato de arquivo inválido', 'Fechar', { duration: 3000 });
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(files);
    const formData = new FormData();
    formData.append('file', files);
    this.prefeituraService.uploadPhotos(formData).subscribe((photo) => {
      this.form.patchValue({
        foto: photo.path,
        fotoId: [photo.id],
      });
      this.cdr.detectChanges();
    });
  }
  deletePhoto() {
    this.form.patchValue({
      driverPhoto: '',
      photosIds: [],
    });
    this.cdr.detectChanges();
  }
  getNextRegistrationNumber() {
    this.prefeituraService.getNextRegistrationNumber().subscribe((number) => {
      this.form.patchValue({
        id: number,
      });
    });
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.getNextRegistrationNumber();
  }

  private create() {
    this.prefeituraService.createPrefeitura(this.form.value).subscribe((prefeitura) => {
      this.snackBar.open('Prefeitura criada com sucesso', 'Fechar', { duration: 3000 });
      this.router.navigate(['/prefeituras']);
    });
  }

  private updatePrefeitura() {
    this.prefeituraService.updatePrefeitura(this.form.value, this.form.value.id).subscribe((prefeitura) => {
      this.snackBar.open('Prefeitura atualizada com sucesso', 'Fechar', { duration: 3000 });
      this.router.navigate(['/prefeituras']);
    });
  }
}
