import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VehicleService } from '../../services/vehicle-service';
import { DriverService } from '../../services/driver-service';
import { Driver } from '../../models/driver';
import { Vehicle } from '../../models/vehicle';
import { NgxMaskDirective } from 'ngx-mask';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MY_DATE_FORMATS } from '../../app.config';

@Component({
  selector: 'app-form-add-vehicle-fine',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgxMaskDirective],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS),     
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-vehicle-fine.html',
  styleUrl: './form-add-vehicle-fine.scss',
})
export class FormAddVehicleFine {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddVehicleFine>);
  public data = inject(MAT_DIALOG_DATA);
  form: FormGroup;
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);
  constructor() {
    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      fineDate: ['', Validators.required],
      fineAmount: ['', Validators.required],
      fineType: ['', Validators.required],
      fineDueDate: ['', Validators.required],
      fineNotes: [''],
    });
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
    this.driverService.getAllDrivers(0, 1000).subscribe((drivers) => {
      this.drivers.set(drivers.data);
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
}
