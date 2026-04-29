import { Component, inject, signal } from '@angular/core';
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
import { MaintenanceService } from '../../services/maintenance-service';
import { VehicleService } from '../../services/vehicle-service';
import { SupplierService } from '../../services/supplier-service';
import { Supplier } from '../../models/supplier';
import { Vehicle } from '../../models/vehicle';
import { SupplierType } from '../../models/supplier-type';
import { MaintenanceTypeService } from '../../services/maintenance-type-service';
import { MaintenanceServiceModel } from '../../models/maintenance-service-model';

@Component({
  selector: 'app-form-add-maintenance-service',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS),     
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-maintenance-service.html',
  styleUrl: './form-add-maintenance-service.scss',
})
export class FormAddMaintenanceService {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddMaintenanceService>);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      maintenanceServiceName: ['', Validators.required],
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
