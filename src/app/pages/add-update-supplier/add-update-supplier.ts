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
    NgxMaskDirective],
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
  constructor() {
    this.form = this.fb.group({
      supplierFantasyName: ['', Validators.required],
      supplierCorporateName: ['', Validators.required],
      supplierCnpj: ['', Validators.required],
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
    console.log(cnpj.length,'cnpj length');
    if (cnpj.length !== 14) {
      return { invalidCnpj: true };
    }
    return null;
  }
  private toUpperCase(control: AbstractControl) {
    return control.value.toUpperCase();
  }
  getCep(cep: string) {
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        supplierAddress: cep.street,
        supplierCity: cep.city,
        supplierState: cep.state,        
        supplierNeighborhood: cep.neighborhood,
      });
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
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Erro ao cadastrar fornecedor', 'Fechar', { duration: 3000 });
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
      this.snackBar.open('Erro ao atualizar fornecedor', 'Fechar', { duration: 3000 });
    }
    });
  }
  private clearForm() {
    this.form.reset();
    this.supplier.set(null);
    this.supplierStateService.setSupplier(null);
    this.update.set(false);
  }
}
