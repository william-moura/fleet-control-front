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
import { ActivatedRoute, Router } from '@angular/router';
import { FuelSupplyService } from '../../services/fuel-supply-service';
import { DriverService } from '../../services/driver-service';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { SupplierType } from '../../models/supplier-type';
import { maxDateValidator } from '../../rules/min-date-validator';
import { map, of } from 'rxjs';
import { Observable } from 'rxjs';
import { AsyncSelect } from '../../components/async-select/async-select';

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
    NgxMaskDirective,
    AsyncSelect],
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
  private route = inject(ActivatedRoute);
  vehicles$ = signal<Observable<Vehicle[]>>(of([]));
  suppliers$ = signal<Observable<Supplier[]>>(of([]));
  drivers$ = signal<Observable<Driver[]>>(of([]));
  constructor() {
    this.form = this.fb.group({
      fuelSupplierDate: ['', [Validators.required, maxDateValidator()]],
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
    this.update.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getSuppliers();
      this.getVehicles();      
      this.getFuelTypes();
      this.fuelSupplyService.getFuelSupplyById(Number(id)).subscribe((fuelSupply) => {
        this.fuel.set(fuelSupply);
        this.update.set(true);
        if (fuelSupply.fuelSupplierDate) {
          const date = fuelSupply.fuelSupplierDate as string;
          fuelSupply.fuelSupplierDate = date.split('-').reverse().join('/');
        }
        this.form.patchValue(fuelSupply);
        this.getDrivers();
      });
    }
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
  async getSuppliers() {
    this.suppliers$.set(this.supplierService.getAllSuppliers(SupplierType.GAS_STATION, 0, 10000).pipe(map((suppliers) => suppliers.data as Supplier[])));
  }
  async getVehicles() {
    this.vehicles$.set(this.vehicleService.getAllVehicles(0, 10000).pipe(map((vehicles) => vehicles.data as Vehicle[])));
  }
  async getDrivers() {
    if (this.form.value.vehicleId) {
      this.drivers$.set(this.vehicleService.getDriversByVehicleId(this.form.value.vehicleId).pipe(map((drivers) => drivers as Driver[])));
    }
  }
  private getFuelTypes() {
    this.vehicleService.getFuelTypes().subscribe((fuelTypes) => {
      this.fuelTypes.set(fuelTypes);
    });
  }
  salvar() {

    if (!this.form.valid) {
      this.validateForms();
      return;
    }

    if (this.update()) {
      this.updateFuelSupply();
    } else {
      this.createFuelSupply();
    }
  }

  private validateForms() {

    if (this.form.controls['supplierId'].errors?.['required']) {
      this.snackBar.open('O campo Fornecedor é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.controls['fuelTypeId'].errors?.['required']) {
      this.snackBar.open('O campo Tipo de Combustível é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.controls['vehicleId'].errors?.['required']) {
      this.snackBar.open('O campo Veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    
    if (this.form.controls['driverId'].errors?.['required']) {
      this.snackBar.open('O campo Motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierDate'].errors?.['required']) {
      this.snackBar.open('O campo Data de Abastecimento é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierDate'].errors?.['maxDate']) {
      this.snackBar.open('A data de abastecimento não pode ser maior que a data atual', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierTotal'].errors?.['required']) {
      this.snackBar.open('O campo Valor do Abastecimento é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierPrice'].errors?.['required']) {
      this.snackBar.open('O campo Valor por Litro é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierQuantity'].errors?.['required']) {
      this.snackBar.open('O campo Quantidade de Litros é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierKilometers'].errors?.['required']) {
      this.snackBar.open('A quilometragem é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.form.controls['fuelSupplierInvoiceNumber'].errors?.['required']) {
      this.snackBar.open('O campo Número do Comprovante é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
  }
  
}
