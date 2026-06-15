import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskDirective } from 'ngx-mask';
import { SupplierService } from '../../services/supplier-service';
import { Driver } from '../../models/driver';
import { VehicleService } from '../../services/vehicle-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vehicle } from '../../models/vehicle';
import { Supplier } from '../../models/supplier';
import { FuelType } from '../../models/fuel-type';
import { FuelSupply } from '../../models/fuel-supply';
import { Router } from '@angular/router';
import { FuelSupplyService } from '../../services/fuel-supply-service';
import { DriverService } from '../../services/driver-service';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { SupplierType } from '../../models/supplier-type';

@Component({
  selector: 'app-add-update-fuel',
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
  templateUrl: './add-update-fuel.html',
  styleUrl: './add-update-fuel.scss',
})
export class AddUpdateFuel {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);
  private vehicleService = inject(VehicleService);
  private snackBar = inject(MatSnackBar);
  drivers = signal<Driver[]>([]);
  vehicles = signal<Vehicle[]>([]);
  suppliers = signal<Supplier[]>([]);
  fuelTypes = signal<FuelType[]>([]);
  form: FormGroup;
  fuel = signal<FuelSupply | null>(null);
  update = signal<boolean>(false);
  private router = inject(Router);
  private fuelSupplyService = inject(FuelSupplyService);
  private driverService = inject(DriverService);
  private fuelSupplyStateService = inject(VehicleStateService);
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
    this.fuel.set(this.fuelSupplyStateService.selectedFuelSupply());
    if (this.fuel()) {
      this.update.set(true);
      const dataForm = { ...this.fuel() };
      if (dataForm.fuelSupplierDate) {
        dataForm.fuelSupplierDate = dataForm.fuelSupplierDate.split('-').reverse().join('/');
      }
      this.form.patchValue(dataForm);
    } else {
      this.update.set(false);
    }
    this.getSuppliers();
    this.getVehicles();
    this.getDrivers();
    this.getFuelTypes();
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/fuel']);
    return;
  }
  private clearForm() {
    this.form.reset();
    this.fuel.set(null);
    this.fuelSupplyStateService.setFuelSupply(null);
  }
  private createFuelSupply() {
    if (!this.form.valid) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.fuelSupplierDate) {
      dataForm.fuelSupplierDate = dataForm.fuelSupplierDate.split('/').reverse().join('-');
    }
    this.fuelSupplyService.createFuelSupply(dataForm as FuelSupply).subscribe({
      next: (fuelSupply) => {
        this.fuel.set(fuelSupply);
        this.snackBar.open('Abastecimento cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/fuel']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar abastecimento:', error);
        this.snackBar.open('Erro ao cadastrar abastecimento', 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateFuelSupply() {
    if (!this.form.valid) {
      return;
    }
    const id = this.fuel()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.fuelSupplierDate) {
      dataForm.fuelSupplierDate = dataForm.fuelSupplierDate.split('/').reverse().join('-');
    }
    this.fuelSupplyService.updateFuelSupply(id, dataForm as FuelSupply).subscribe({
      next: (fuelSupply) => {
        this.fuel.set(fuelSupply);
        this.snackBar.open('Abastecimento atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/fuel']);
      },
      error: (error) => {
        console.error('Erro ao atualizar abastecimento:', error);
        this.snackBar.open('Erro ao atualizar abastecimento', 'Fechar', { duration: 3000 });
      }
    });
  }
  private getSuppliers() {
    this.supplierService.getAllSuppliers(SupplierType.GAS_STATION, 0, 10000).subscribe((suppliers) => {
      this.suppliers.set(suppliers.data);
    });
  }
  private getVehicles() {
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
  }
  getDrivers() {
    if (this.form.value.vehicleId) {
      this.vehicleService.getDriversByVehicleId(this.form.value.vehicleId).subscribe((drivers) => {
        this.drivers.set(drivers);
      });
    }
  }
  private getFuelTypes() {
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
  }
  salvar() {
    if (this.update()) {
      this.updateFuelSupply();
    } else {
      this.createFuelSupply();
    }
  }
}
