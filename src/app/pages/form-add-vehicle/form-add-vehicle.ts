import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../models/brand';
import { VehicleService } from '../../services/vehicle-service';
import { FuelType } from '../../models/fuel-type';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../app.config';

@Component({
  selector: 'app-form-add-vehicle',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule
  ],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS), 
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-vehicle.html',
  styleUrl: './form-add-vehicle.scss',
})
export class FormAddVehicle {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddVehicle>);
  private vehicleService = inject(VehicleService);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  brands = signal<Brand[]>([]);
  fuelTypes = signal<FuelType[]>([]);
  constructor() {
    this.form = this.fb.group({
      vehiclePlate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/)]], // Padrão Mercosul
      brandId: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      fuelTypeId: ['', Validators.required],
      vehicleTankCapacity: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      vehicleCurrentMileage: ['', [Validators.required, Validators.min(0)]],
      vehiclePurchaseDate: ['', Validators.required],
      vehicleNotes: [''],
      vehicleStatus: ['', Validators.required],
    });
    this.vehicleService.getBrands().subscribe((brands) => {
      this.brands.set(brands);
    });
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = { ...this.data };
      if (dataForm.vehiclePurchaseDate) {
        dataForm.vehiclePurchaseDate = new Date(dataForm.vehiclePurchaseDate.toString().split('/').reverse().join('-') + 'T00:00:00');        
      }
      dataForm.vehicleStatus = dataForm.vehicleStatus === 'Ativo' || dataForm.vehicleStatus === 'ativo'  ? '1' : '0';
      console.log(dataForm, 'dataForm');
      this.form.patchValue(dataForm);
      this.form.get('vehicleId')?.disable();
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
