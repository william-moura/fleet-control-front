import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NgxMaskDirective } from 'ngx-mask';
import { UppercaseDirective } from '../../uppercase';
import { CepService } from '../../services/cep-service';

@Component({
  selector: 'app-form-add-km-component',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaskDirective, UppercaseDirective],
  templateUrl: './form-add-km-component.html',
  styleUrl: './form-add-km-component.scss',
})
export class FormAddKmComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddKmComponent>);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      km: ['', Validators.required],
      vehicleId: ['', Validators.required],
      kmDate: ['', Validators.required],
      kmNotes: [''],
      driverId: ['', Validators.required],
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
