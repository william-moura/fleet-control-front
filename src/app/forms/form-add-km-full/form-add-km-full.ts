import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle';
import { Driver } from '../../models/driver';
import { Pagination } from '../../models/pagination';
import { VehicleService } from '../../services/vehicle-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MY_DATE_FORMATS } from '../../app.config';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-add-km-full',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaskDirective],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS),     
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './form-add-km-full.html',
  styleUrl: './form-add-km-full.scss',
})
export class FormAddKmFull implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<FormAddKmFull>);
  public data = inject(MAT_DIALOG_DATA);
  private vehicleService = inject(VehicleService);
  form: FormGroup;
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);
  private snackBar = inject(MatSnackBar);
  constructor() {
    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      kilometersValue: ['', Validators.required],
      kilometersDate: ['', Validators.required],
      kilometersNotes: [''],
    });
  }
  ngOnInit() {
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles: Pagination<Vehicle>) => {
      this.vehicles.set(vehicles.data);
    });    
    if (this.data) {
      const dataForm = { ...this.data };
      this.form.patchValue(dataForm);
    }
  }
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  getDriversByVehicleId(vehicleId: number) {
    this.vehicleService.getDriversByVehicleId(vehicleId).subscribe((drivers: Driver[]) => {
      this.drivers.set(drivers);
    });
  }
}
