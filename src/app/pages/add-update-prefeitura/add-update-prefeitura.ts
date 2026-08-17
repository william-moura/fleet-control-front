import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  prefeitura = signal<Prefeitura | null>(null);
  constructor(private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      cnpj: ['', [Validators.required, this.validateCnpj]],
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
    if (this.form.get('razaoSocial')?.errors?.['required']) {
      this.snackBar.open('Razão Social é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('nomeFantasia')?.errors?.['required']) {
      this.snackBar.open('Nome Fantasia é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('cnpj')?.errors?.['invalidCnpj']) {
      this.snackBar.open('CNPJ inválido', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('telefone')?.errors?.['required']) {
      this.snackBar.open('Telefone é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('cep')?.errors?.['required']) {
      this.snackBar.open('CEP é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('endereco')?.errors?.['required']) {
      this.snackBar.open('Endereço é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('bairro')?.errors?.['required']) {
      this.snackBar.open('Bairro é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('cidade')?.errors?.['required']) {
      this.snackBar.open('Cidade é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('uf')?.errors?.['required']) {
      this.snackBar.open('Estado é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('numero')?.errors?.['required']) {
      this.snackBar.open('Número é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.get('email')?.errors?.['email']) {
      this.snackBar.open('Email inválido', 'Fechar', { duration: 3000 });
      return;
    }

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
    this.update.set(false);
    this.prefeituraService.getOnePrefeitura().subscribe({
      next: (prefeitura) => {
        this.update.set(true);
        this.form.patchValue(prefeitura);
        this.cdr.detectChanges();
        this.prefeitura.set(prefeitura);
    }, error: (error) => {
      console.error('Erro ao buscar prefeitura:', error);
      this.prefeitura.set(null);
      this.getNextRegistrationNumber();
    }});
    // if (id) {
    //   this.update.set(true);
    //   this.prefeituraService.getPrefeituraById(Number(id)).subscribe((prefeitura) => {
    //     this.form.patchValue(prefeitura);
    //     const photo = prefeitura.photos?.[0];
    //     if (photo) {
    //       this.form.patchValue({
    //         foto: photo.path,
    //         fotoId: [photo.id],
    //       });
    //     }
    //     this.cdr.detectChanges();
    //     this.prefeitura.set(prefeitura);
    //   });
    // } else {
    //   this.prefeitura.set(null);
    //   this.getNextRegistrationNumber();
    // }
  }

  private create() {
    this.prefeituraService.createPrefeitura(this.form.value).subscribe({
      next: (prefeitura) => {
      this.snackBar.open('Prefeitura criada com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/prefeituras']);
      },
      error: (error) => {
        console.error('Erro ao criar prefeitura:', error);
        this.snackBar.open('Erro ao criar prefeitura ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }

  private updatePrefeitura() {
    const id = this.prefeitura()?.id;
    if (id) {
      this.prefeituraService.updatePrefeitura(this.form.value, Number(id)).subscribe({
        next: (prefeitura) => {
          this.snackBar.open('Prefeitura atualizada com sucesso', 'Fechar', { duration: 3000 });
          this.router.navigate(['/prefeituras']);
        },
        error: (error) => {
          console.error('Erro ao atualizar prefeitura:', error);
          this.snackBar.open('Erro ao atualizar prefeitura ' + error.message, 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  private validateCnpj(control: AbstractControl) {
    const cnpj = control.value;
    // 1. Remove caracteres não numéricos
    const numeros = cnpj.replace(/[^\d]/g, '');

    // 2. CNPJ deve ter exatamente 14 dígitos
    if (numeros.length !== 14) return { invalidCnpj: true };

    // 3. Elimina sequências inválidas conhecidas (ex: 00000000000000)
    if (/^(\d)\1+$/.test(numeros)) return { invalidCnpj: true };

    // 4. Validação dos 2 dígitos verificadores
    const tamanho = numeros.length - 2;
    const numerosSemDigitos = numeros.substring(0, tamanho);
    const digitosVerificadores = numeros.substring(tamanho);

    let soma = 0;
    let peso = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numerosSemDigitos.charAt(tamanho - i)) * peso--;
      if (peso < 2) peso = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitosVerificadores.charAt(0))) return { invalidCnpj: true };

    soma = 0;
    peso = tamanho - 6;

    for (let i = tamanho + 1; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho + 1 - i)) * peso--;
      if (peso < 2) peso = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitosVerificadores.charAt(1))) return { invalidCnpj: true };

    return null;
  }
}
