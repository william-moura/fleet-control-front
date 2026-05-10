import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportCard } from '../../models/report-card';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle } from '../../models/vehicle';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver-service';
import { MY_DATE_FORMATS } from '../../app.config';

@Component({
  selector: 'app-filter-report-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule],
  providers:[
    provideNativeDateAdapter(MY_DATE_FORMATS), 
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  templateUrl: './filter-report-component.html',
  styleUrl: './filter-report-component.scss',
})
export class FilterReportComponent implements OnInit {
  form: FormGroup;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FilterReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportCard
  ) {
    this.form = this.fb.group({
      startDate: ['', this.data.filter ? Validators.required : null],
      endDate: ['', this.data.filter ? Validators.required : null],
      vehicleId: [''],
      driverId: [''],
    });
  }
  // data = inject(MAT_DIALOG_DATA);
  ngOnInit() {    
    this.vehicleService.getAllVehicles(0, 10000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
    this.driverService.getAllDrivers(0, 10000).subscribe((drivers) => {
      this.drivers.set(drivers.data);
    });
  }

  gerar() {
    try {
      const dadosForm = this.form.value;
      if (dadosForm.startDate) {
        dadosForm.startDate = dadosForm.startDate.toISOString();
      }
      if (dadosForm.endDate) {
        dadosForm.endDate = dadosForm.endDate.toISOString();
      }
      console.log(dadosForm, 'dados form')
      this.dialogRef.close(dadosForm); 
    } catch (error) {
      console.error('Erro ao fechar modal:', error);
    }
  }
}
