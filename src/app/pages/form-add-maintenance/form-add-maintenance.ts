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
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form-add-maintenance',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgxMaskDirective],
  templateUrl: './form-add-maintenance.html',
  styleUrl: './form-add-maintenance.scss',
})
export class FormAddMaintenance {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddMaintenance>);
  private maintenanceService = inject(MaintenanceService);
  private supplierService = inject(SupplierService);
  private vehicleService = inject(VehicleService);
  private maintenanceTypeService = inject(MaintenanceTypeService);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  suppliers = signal<Supplier[]>([]);
  vehicles = signal<Vehicle[]>([]);
  services = signal<MaintenanceServiceModel[]>([]);
  constructor() {
    this.form = this.fb.group({
      maintenanceDate: ['', Validators.required],
      services: ['', Validators.required],
      maintenanceCost: ['', Validators.required],
      maintenanceNextDate: ['', Validators.required],
      maintenanceKilometers: ['', Validators.required],
      maintenancePreviousDateFinished: ['', Validators.required],
      maintenanceNotes: [''],
      vehicleId: ['', Validators.required],
      supplierId: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.data.services = this.data.services.map((service: MaintenanceServiceModel) => service.id);
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
    this.getSuppliers();
    this.getVehicles();
    this.getMaintenanceTypes();    
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
    this.supplierService.getAllSuppliers(SupplierType.MECHANIC, 0, 10000).subscribe((suppliers) => {
      this.suppliers.set(suppliers.data);
    });
  }
  getVehicles() {
    this.vehicleService.getAllVehicles(0, 10000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
  }
  getMaintenanceTypes() {
    this.maintenanceTypeService.getAllMaintenanceTypes(0, 10000).subscribe((maintenanceTypes) => {
      this.services.set(maintenanceTypes.data);      
    });
  }
}
