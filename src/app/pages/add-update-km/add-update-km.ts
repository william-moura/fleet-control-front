import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective } from 'ngx-mask';
import { VehicleService } from '../../services/vehicle-service';
import { DriverService } from '../../services/driver-service';
import { Vehicle } from '../../models/vehicle';
import { Driver } from '../../models/driver';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { Kilometer } from '../../models/kilometer';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KilometerService } from '../../services/kilometer-service';

@Component({
  selector: 'app-add-update-km',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective],
  templateUrl: './add-update-km.html',
  styleUrl: './add-update-km.scss',
})
export class AddUpdateKm {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);
  form: FormGroup;
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);
  vehicle = signal<Vehicle | null>(null);
  update = signal<boolean>(false);
  private vehicleStateService = inject(VehicleStateService);
  kilometer = signal<Kilometer | null>(null);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private kilometerService = inject(KilometerService);
  constructor() {
    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      kilometersValue: ['', Validators.required],
      kilometersDate: ['', Validators.required],
      kilometersNotes: [''],
    });
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
  }
  ngOnInit() {
    this.update.set(false);    
    this.kilometer.set(this.vehicleStateService.selectedKilometer());
    if (this.kilometer()) {
      const vehicleId = this.kilometer()?.vehicleId;
      if (vehicleId) {
         this.getDriversByVehicleId(vehicleId);
      }
      this.update.set(true);
      const dataForm = { ...this.kilometer() };
      if (dataForm.kilometersDate) {
        dataForm.kilometersDate = dataForm.kilometersDate.split('-').reverse().join('/');
      }
      this.form.patchValue(dataForm);
    }
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/kilometers']);
    return;
  }
  private clearForm() {
    this.form.reset();
    this.vehicle.set(null);
    this.kilometer.set(null);
    this.vehicleStateService.setKilometer(null);
    this.update.set(false);
  }
  private createKilometer() {
    if (!this.form.valid) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.kilometersDate) {
      dataForm.kilometersDate = dataForm.kilometersDate.split('/').reverse().join('-');
    }
    this.vehicleService.createKilometer(dataForm.vehicleId, dataForm as Kilometer).subscribe({
      next: (kilometer) => {
        this.kilometer.set(kilometer);
        this.snackBar.open('Quilometragem cadastrada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/kilometers']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar quilometragem:', error);
        this.snackBar.open('Erro ao cadastrar quilometragem', 'Fechar', { duration: 3000 });
      }
    });
  }
  salvar() {
    if (this.update()) {
      this.updateKilometer();
    } else {
      this.createKilometer();
    }
  }
  private updateKilometer() {
    if (!this.form.valid) {
      return;
    }
    const id = this.kilometer()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.kilometersDate) {
      dataForm.kilometersDate = dataForm.kilometersDate.split('-').reverse().join('/');
    }
    this.kilometerService.updateKilometer(id, dataForm).subscribe({
      next: (kilometer) => {
        this.kilometer.set(kilometer);
        this.snackBar.open('Quilometragem atualizada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/kilometers']);
      },
      error: (error) => {
        console.error('Erro ao atualizar quilometragem:', error);
        this.snackBar.open('Erro ao atualizar quilometragem', 'Fechar', { duration: 3000 });
      }
    });
  }
  async getDriversByVehicleId(vehicleId: number) {
    await this.vehicleService.getDriversByVehicleId(vehicleId).subscribe((drivers: Driver[]) => {
      this.drivers.set(drivers);
    });
  }
}
