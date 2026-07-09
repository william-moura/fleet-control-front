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
import { VehicleFineService } from '../../services/vehicle-fine-service';
import { Driver } from '../../models/driver';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle-service';
import { DriverService } from '../../services/driver-service';
import { VehicleFine } from '../../models/vehicle-fine';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-vehicle-fine',
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
  templateUrl: './add-update-vehicle-fine.html',
  styleUrl: './add-update-vehicle-fine.scss',
})
export class AddUpdateVehicleFine {
  private fb = inject(FormBuilder);
  private vehicleFineService = inject(VehicleFineService);
  private vehicleService = inject(VehicleService);
  private driverService = inject(DriverService);  
  form: FormGroup;
  vehicles = signal<Vehicle[]>([]);
  drivers = signal<Driver[]>([]);
  vehicleFine = signal<VehicleFine | null>(null);
  private vehicleFineStateService = inject(VehicleStateService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  update = signal<boolean>(false);
  private route = inject(ActivatedRoute);
  constructor() {
    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', Validators.required],
      fineDate: ['', Validators.required],
      fineAmount: ['', Validators.required],
      fineLevel: ['', Validators.required],
      finePaidDate: ['', Validators.required],
      fineNotes: [''],
      fineStatus: ['', ],
      finePoints: ['', [Validators.required, Validators.min(1)]],
    });
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
    this.driverService.getAllDrivers(0, 1000).subscribe((drivers) => {
      this.drivers.set(drivers.data);
    });
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleFineService.getVehicleFineById(Number(id)).subscribe((vehicleFine) => {
        this.vehicleFine.set(vehicleFine);
        this.update.set(true);
        if (vehicleFine.finePaidDate) {
          const paidDate = vehicleFine.finePaidDate as string;
          vehicleFine.finePaidDate = paidDate.split('-').reverse().join('/');
        }
        if (vehicleFine.fineDate) {
          const date = vehicleFine.fineDate as string;
          vehicleFine.fineDate = date.split('-').reverse().join('/');
        }
        this.form.patchValue(vehicleFine);
      });
    }
    this.update.set(false);
    this.vehicleFine.set(this.vehicleFineStateService.selectedVehicleFine());
    if (this.vehicleFine()) {
      this.update.set(true);
      const dataForm = { ...this.vehicleFine() };
      if (dataForm.finePaidDate) {
        dataForm.finePaidDate = dataForm.finePaidDate.split('-').reverse().join('/');
      }
      if (dataForm.fineDate) {
        dataForm.fineDate = dataForm.fineDate.split('-').reverse().join('/');
      }      
      this.form.patchValue(dataForm);
    }
  }
  salvar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.update()) {
      this.updateVehicleFine();
    } else {
      this.createVehicleFine();
    }
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/vehicle-fines']);
  }

  private clearForm() {
    this.form.patchValue({});
    this.vehicleFine.set(null);
    this.vehicles.set([]);
    this.drivers.set([]);
    this.vehicleFineStateService.setVehicleFine(null);
  }
  voltar() {
    this.clearForm();
    this.router.navigate(['/vehicle-fines']);
  }
  private createVehicleFine() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.finePaidDate) {
      dataForm.finePaidDate = dataForm.finePaidDate.split('/').reverse().join('-');
    }
    if (dataForm.fineDate) {
      dataForm.fineDate = dataForm.fineDate.split('/').reverse().join('-');
    }
    this.vehicleFineService.createVehicleFine(dataForm as VehicleFine).subscribe({
      next: (vehicleFine) => {
        this.vehicleFine.set(vehicleFine);
        this.vehicleFine.set(vehicleFine);
        this.snackBar.open('Multa cadastrada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/vehicle-fines']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar multa:', error);
        this.snackBar.open('Erro ao cadastrar multa', 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateVehicleFine() {
    if (!this.vehicleFine()) {
      return;
    }
    const id = this.vehicleFine()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.finePaidDate) {
      dataForm.finePaidDate = dataForm.finePaidDate.split('/').reverse().join('-');
    }
    if (dataForm.fineDate) {
      dataForm.fineDate = dataForm.fineDate.split('/').reverse().join('-');
    }
    this.vehicleFineService.updateVehicleFine(id, dataForm).subscribe({
      next: (vehicleFine) => {
        this.vehicleFine.set(vehicleFine);
        this.snackBar.open('Multa atualizada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/vehicle-fines']);
      },
      error: (error) => {
        console.error('Erro ao atualizar multa:', error);
        this.snackBar.open('Erro ao atualizar multa', 'Fechar', { duration: 3000 });
      }
    });
  }
}
