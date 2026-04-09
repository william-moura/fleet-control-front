import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../app.config';
import { SupplierService } from '../../services/supplier-service';
import { SupplierType } from '../../models/supplier-type';
@Component({
  selector: 'app-form-add-supplier',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS), 
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-supplier.html',
  styleUrl: './form-add-supplier.scss',
})
export class FormAddSupplier {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddSupplier>);
  private supplierService = inject(SupplierService);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      supplierFantasyName: ['', Validators.required],
      supplierCorporateName: ['', Validators.required],
      supplierCnpj: ['', Validators.required],
      supplierAddress: ['', Validators.required],
      supplierCity: ['', Validators.required],
      supplierState: ['', Validators.required],
      supplierZipCode: ['', Validators.required],
      supplierPhone: ['', Validators.required],
      supplierEmail: ['', Validators.required],
      supplierStatus: ['', Validators.required],
      supplierType: ['', Validators.required],
    }, {
      validator: [
        Validators.required,
        Validators.min(0),
        Validators.max(2),
      ]
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
  }
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value,'supplierType');
      this.form.value.supplierType = Number(this.form.value.supplierType);
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
