import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../app.config';
import { DriverService } from '../../services/driver-service';

@Component({
  selector: 'app-form-add-driver',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS), 
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-driver.html',
  styleUrl: './form-add-driver.scss',
})
export class FormAddDriver {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddDriver>);
  private driverService = inject(DriverService);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      registeredNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      bloodType: ['', Validators.required],
      rg: ['', Validators.required],
      cpf: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      licenseExpirationDate: ['', Validators.required],
      licenseCategory: ['', Validators.required],
      birthDate: ['', Validators.required],
      phone: ['', Validators.required],
      status: ['', Validators.required],
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
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
