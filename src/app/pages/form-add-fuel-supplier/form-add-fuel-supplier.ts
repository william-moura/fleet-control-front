import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { SupplierService } from '../../services/supplier-service';
import { Supplier } from '../../models/supplier';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle } from '../../models/vehicle';
import { Driver } from '../../models/driver';
import { FuelType } from '../../models/fuel-type';
import { MY_DATE_FORMATS } from '../../app.config';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form-add-fuel-supplier',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatDatepickerModule, MatNativeDateModule, NgxMaskDirective],
  templateUrl: './form-add-fuel-supplier.html',
  styleUrl: './form-add-fuel-supplier.scss',
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS),     
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
})
export class FormAddFuelSupplier {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddFuelSupplier>);
  public data = inject(MAT_DIALOG_DATA);
  private supplierService = inject(SupplierService);
  private vehicleService = inject(VehicleService);
  
  drivers = signal<Driver[]>([]);
  vehicles = signal<Vehicle[]>([]);
  suppliers = signal<Supplier[]>([]);
  fuelTypes = signal<FuelType[]>([]);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      fuelSupplierDate: ['', Validators.required],
      fuelSupplierQuantity: ['', [Validators.required, Validators.min(0)]],
      fuelSupplierTotal: ['', [Validators.required, Validators.min(0)]],
      supplierId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      fuelTypeId: ['', Validators.required],
      driverId: ['', Validators.required],
      fuelSupplierKilometers: ['', [Validators.required, Validators.min(0)]],
      fuelSupplierPrice: ['', [Validators.required, Validators.min(0)]],
      fuelSupplierInvoiceNumber: ['', Validators.required],
      fuelSupplierNotes: [''],
    });
  }
  ngOnInit() {
    if (this.data) {
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
    this.getSuppliers();
    this.getVehicles();
    this.getFuelTypes();
    this.getDrivers();
    this.form.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  getSuppliers() {
    this.supplierService.getAllSuppliers().subscribe((suppliers) => {
      this.suppliers.set(suppliers);
    });
  }
  getVehicles() {
    this.vehicleService.getAllVehicles().subscribe((vehicles) => {
      this.vehicles.set(vehicles);
    });
  }
  getDrivers() {
    if (this.form.value.vehicleId) {
      this.vehicleService.getDriversByVehicleId(this.form.value.vehicleId).subscribe((drivers) => {
        this.drivers.set(drivers);
      });
    }
  }
  getFuelTypes() {
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
  }
  calculateTotal() {
    const quantity = Number(this.form.value.fuelSupplierQuantity);
    const price = Number(this.form.value.fuelSupplierPrice);
    const total = quantity * price;
    this.form.get('fuelSupplierTotal')?.setValue(total.toFixed(2), { emitEvent: false });    
  }
}
