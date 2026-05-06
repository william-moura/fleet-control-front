import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportCard } from '../../models/report-card';
import { VehicleService } from '../../services/vehicle-service';
import { Vehicle } from '../../models/vehicle';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver-service';

@Component({
  selector: 'app-filter-report-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule],
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
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      vehicleId: [''],
      driverId: [''],
    });
  }
  // data = inject(MAT_DIALOG_DATA);
  ngOnInit() {
    console.log(this.data, 'data');
    this.vehicleService.getAllVehicles(0, 10000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
    this.driverService.getAllDrivers(0, 10000).subscribe((drivers) => {
      this.drivers.set(drivers.data);
    });
  }

  gerar() {
    console.log('Tentando fechar o modal...');
    try {
      const dadosForm = this.form.value;
      this.dialogRef.close(dadosForm); 
    } catch (error) {
      console.error('Erro ao fechar modal:', error);
    }
  }
}
