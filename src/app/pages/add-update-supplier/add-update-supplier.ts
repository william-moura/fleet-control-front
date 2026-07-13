import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CepService } from '../../services/cep-service';
import { SupplierService } from '../../services/supplier-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../../models/supplier';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-add-update-supplier',
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
    NgxMaskDirective,
    MatProgressSpinnerModule],
  templateUrl: './add-update-supplier.html',
  styleUrl: './add-update-supplier.scss',
})
export class AddUpdateSupplier {
  private fb = inject(FormBuilder);  
  private supplierService = inject(SupplierService);  
  private snackBar = inject(MatSnackBar);
  form: FormGroup;
  private cepService = inject(CepService);
  private router = inject(Router);
  supplier = signal<Supplier | null>(null);
  update = signal<boolean>(false);
  private supplierStateService = inject(VehicleStateService);
  private route = inject(ActivatedRoute);
  loading = signal<boolean>(false);
  constructor() {
    this.form = this.fb.group({
      supplierFantasyName: ['', Validators.required],
      supplierCorporateName: ['', Validators.required],
      supplierCnpj: ['', [Validators.required, this.validateCnpj]],
      supplierAddress: ['', Validators.required],
      supplierCity: ['', Validators.required],
      supplierState: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      supplierZipCode: ['', Validators.required],
      supplierPhone: ['', Validators.required],
      supplierEmail: ['', [Validators.required, Validators.email]],
      supplierStatus: ['', Validators.required],
      supplierType: ['', Validators.required],
      supplierNeighborhood: ['', Validators.required],      
    });
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

  getCep(cep: string) {
    this.loading.set(true);
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        supplierAddress: cep.street,
        supplierCity: cep.city,
        supplierState: cep.state,        
        supplierNeighborhood: cep.neighborhood,
      });
      this.loading.set(false);
    }, error => {
      this.loading.set(false);
      this.snackBar.open('Erro ao buscar CEP, verifique se o CEP é válido', 'Fechar', { duration: 3000 });
    });
  }
  ngOnInit() {
    this.update.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.supplierService.getSupplierById(Number(id)).subscribe((supplier) => {
        this.supplier.set(supplier);
        this.update.set(true);
        if (supplier.supplierCnpj) {
          supplier.supplierCnpj = supplier.supplierCnpj.replace(/[^0-9]/g, '');
        }
        supplier.supplierStatus = supplier.supplierStatus === 1? '1' : '0';
        const supplierType = supplier.supplierType === 1? '1' : '2';
        this.form.patchValue(supplier);
        this.form.patchValue({ supplierType: supplierType });
      });
    }
    this.supplier.set(this.supplierStateService.selectedSupplier());
    if (this.supplier()) {
      this.update.set(true);
      const dataForm = { ...this.supplier() };      
      this.form.patchValue(dataForm);
      this.form.patchValue({ supplierType: dataForm.supplierType === 1? '1' : '2' });
      this.form.patchValue({ supplierStatus: dataForm.supplierStatus === 1? '1' : '0' });      
    } else {
      this.update.set(false);
    }
  }
  cancelar() {
    this.router.navigate(['/supplier']);
  }
  salvar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.functionValidateForm();
      return;
    }
    if (this.form.valid) {
      if (this.update()) {
        this.updateSupplier();
      } else {
        this.createSupplier();
      }
    }
  }
  private createSupplier() {
    if (!this.form.valid) {
      return;
    }
    const dataForm = { ...this.form.value };
    this.supplierService.createSupplier(dataForm as Supplier).subscribe({
      next: (supplier) => {
        this.supplier.set(supplier);
        this.snackBar.open('Fornecedor cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/supplier']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar fornecedor:', error);
        this.snackBar.open('Erro ao cadastrar fornecedor ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateSupplier() {
    if (!this.form.valid) {
      return;
    }
    const id = this.supplier()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    this.supplierService.updateSupplier(id, dataForm as Supplier).subscribe({
      next: (supplier) => {
      this.supplier.set(supplier);
      this.snackBar.open('Fornecedor atualizado com sucesso', 'Fechar', { duration: 3000 });
      this.clearForm();
      this.router.navigate(['/supplier']);
    },
    error: (error) => {
      console.error('Erro ao atualizar fornecedor:', error);
      this.snackBar.open('Erro ao atualizar fornecedor ' + error.message, 'Fechar', { duration: 3000 });
    }
    });
  }
  private clearForm() {
    this.form.reset();
    this.supplier.set(null);
    this.supplierStateService.setSupplier(null);
    this.update.set(false);
  }

  private functionValidateForm() {
    if (this.form.get('supplierFantasyName')?.errors?.['required']) {
      this.snackBar.open('O campo Nome Fantasia é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierCorporateName')?.errors?.['required']) {
      this.snackBar.open('O campo Razão Social é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierCnpj')?.errors?.['required']) {
      this.snackBar.open('O campo CNPJ é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierCnpj')?.errors?.['invalidCnpj']) {
      this.snackBar.open('O campo CNPJ é inválido', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierZipCode')?.errors?.['required']) {
      this.snackBar.open('O campo CEP é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierAddress')?.errors?.['required']) {
      this.snackBar.open('O campo Endereço é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierNeighborhood')?.errors?.['required']) {
      this.snackBar.open('O campo Bairro é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierCity')?.errors?.['required']) {
      this.snackBar.open('O campo Cidade é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierState')?.errors?.['required']) {
      this.snackBar.open('O campo Estado é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierPhone')?.errors?.['required']) {
      this.snackBar.open('O campo Telefone é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierEmail')?.errors?.['required']) {
      this.snackBar.open('O campo Email é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierEmail')?.errors?.['email']) {
      this.snackBar.open('O campo Email é inválido', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierStatus')?.errors?.['required']) {
      this.snackBar.open('O campo Status é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('supplierType')?.errors?.['required']) {
      this.snackBar.open('O campo Tipo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    return;
  }
}
