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
import { FuelSupplyService } from '../../services/fuel-supply-service';
import { SupplierService } from '../../services/supplier-service';
import { Supplier } from '../../models/supplier';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle } from '../../models/vehicle';
import { DriverService } from '../../services/driver-service';
import { Driver } from '../../models/driver';
import { FuelType } from '../../models/fuel-type';
import { MY_DATE_FORMATS } from '../../app.config';
@Component({
  selector: 'app-form-add-fuel-supplier',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './form-add-fuel-supplier.html',
  styleUrl: './form-add-fuel-supplier.scss',
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS), 
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
})
export class FormAddFuelSupplier {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddFuelSupplier>);
  private fuelSupplyService = inject(FuelSupplyService);
  public data = inject(MAT_DIALOG_DATA);
  private supplierService = inject(SupplierService);
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);
  
  drivers = signal<Driver[]>([]);
  vehicles = signal<Vehicle[]>([]);
  suppliers = signal<Supplier[]>([]);
  fuelTypes = signal<FuelType[]>([]);
  form: FormGroup;
  constructor() {
    this.form = this.fb.group({
      fuelSupplierDate: ['', Validators.required],
      fuelSupplierQuantity: ['', Validators.required],
      fuelSupplierTotalValue: ['', Validators.required],
      supplierId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      fuelTypeId: ['', Validators.required],
      driverId: ['', Validators.required],
      fuelSupplierKilometer: ['', Validators.required],
      fuelSupplierPrice: ['', Validators.required],
      fuelSupplierInvoice: ['', Validators.required],
      fuelSupplierNotes: ['', Validators.required],
      fuelSupplierPricePerLiter: ['', Validators.required],
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
    // this.getDrivers();
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
    this.vehicleService.getDriversByVehicleId(this.form.value.vehicleId).subscribe((drivers) => {
      this.drivers.set(drivers);
    });
  }
  getFuelTypes() {
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
  }
}
