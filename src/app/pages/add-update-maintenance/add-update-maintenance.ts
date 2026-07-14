import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { NgxMaskDirective } from 'ngx-mask';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VehicleService } from '../../services/vehicle-service';
import { SupplierService } from '../../services/supplier-service';
import { MaintenanceService } from '../../services/maintenance-service';
import { Vehicle } from '../../models/vehicle';
import { Supplier } from '../../models/supplier';
import { MaintenanceServiceModel } from '../../models/maintenance-service-model';
import { Maintenance } from '../../models/maintenance';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { SupplierType } from '../../models/supplier-type';
import { MaintenanceTypeService } from '../../services/maintenance-type-service';
import { ActivatedRoute, Router } from '@angular/router';
import { minDateValidator } from '../../rules/min-date-validator';
import { map, Observable } from 'rxjs';
import { of } from 'rxjs';
import { AsyncSelect } from '../../components/async-select/async-select';

@Component({
  selector: 'app-add-update-maintenance',
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
    NgxMaskDirective,AsyncSelect],
  templateUrl: './add-update-maintenance.html',
  styleUrl: './add-update-maintenance.scss',
})
export class AddUpdateMaintenance {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private maintenanceService = inject(MaintenanceService);
  private supplierService = inject(SupplierService);
  form: FormGroup;
  vehicles = signal<Vehicle[]>([]);
  services = signal<MaintenanceServiceModel[]>([]);
  suppliers = signal<Supplier[]>([]);
  maintenance = signal<Maintenance | null>(null);
  update = signal<boolean>(false);
  private snackBar = inject(MatSnackBar);
  private vehicleStateService = inject(VehicleStateService);
  private maintenanceTypeService = inject(MaintenanceTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isLoading = signal<boolean>(true);
  vehicles$ = signal<Observable<Vehicle[]>>(of([]));
  suppliers$ = signal<Observable<Supplier[]>>(of([]));
  services$ = signal<Observable<MaintenanceServiceModel[]>>(of([]));

  constructor() {
    this.form = this.fb.group({
      maintenanceDate: ['', Validators.required],
      services: ['', Validators.required],
      maintenanceCost: ['', Validators.required],
      maintenanceNextDate: ['', [Validators.required, this.validateMaintenanceNextDate()]],
      maintenanceKilometers: ['', Validators.required],
      maintenancePreviousDateFinished: ['', [Validators.required, this.validateMaintenanceNextDate()]],
      maintenanceNotes: [''],
      vehicleId: ['', Validators.required],
      supplierId: ['', Validators.required],
      maintenanceNextKilometers: ['', [Validators.required, Validators.min(0)]],
    });
    this.vehicleService.getAllVehicles(0, 1000).subscribe((vehicles) => {
      this.vehicles.set(vehicles.data);
    });
    this.supplierService.getAllSuppliers(SupplierType.MECHANIC, 0, 1000).subscribe((suppliers) => {
      this.suppliers.set(suppliers.data);
    });
    this.maintenanceTypeService.getAllMaintenanceTypes(0, 1000).subscribe((maintenanceServices) => {
      this.services.set(maintenanceServices.data);
    });
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getVehicles();
      this.getSuppliers();
      this.getServices();
      this.maintenanceService.getMaintenanceById(Number(id)).subscribe((maintenance) => {
        this.maintenance.set(maintenance);
        this.update.set(true);
        if (maintenance.maintenanceDate) {
          const date = maintenance.maintenanceDate as string;
          maintenance.maintenanceDate = date.split('-').reverse().join('/');
        }
        if (maintenance.maintenanceNextDate) {
          const date = maintenance.maintenanceNextDate as string;
          maintenance.maintenanceNextDate = date.split('-').reverse().join('/');
        }
        if (maintenance.maintenancePreviousDateFinished) {
          const date = maintenance.maintenancePreviousDateFinished as string;
          maintenance.maintenancePreviousDateFinished = date.split('-').reverse().join('/');
        }        
        this.form.patchValue({ ...maintenance });
        if (maintenance.services) {
          const services = maintenance.services.map((service: MaintenanceServiceModel) => service.id);          
          if (services) {
            maintenance.services = [];            
            this.form.patchValue({ services: services });
          }
        }        
      });
    } else {
      this.update.set(false);
    }
    
    this.maintenance.set(this.vehicleStateService.selectedMaintenance());
    if (this.maintenance()) {
      this.update.set(true);
      const dataForm = { ...this.maintenance() };
      if (dataForm.maintenanceDate) {
        dataForm.maintenanceDate = dataForm.maintenanceDate.split('-').reverse().join('/');
      }
      if (dataForm.maintenanceNextDate) {
        dataForm.maintenanceNextDate = dataForm.maintenanceNextDate.split('-').reverse().join('/');
      }
      if (dataForm.maintenancePreviousDateFinished) {
        dataForm.maintenancePreviousDateFinished = dataForm.maintenancePreviousDateFinished.split('-').reverse().join('/');
      }      
      const services = dataForm.services?.map((service: MaintenanceServiceModel) => service.id);      
      this.form.patchValue({ ...dataForm });
      if (services) {
        dataForm.services = [];
        this.form.patchValue({ services: services });
      }      
    }
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/maintenance']);
    return;
  }
  private clearForm() {
    this.form.reset();
    this.maintenance.set(null);
    this.vehicleStateService.setMaintenance(null);
  }
  private createMaintenance() {
    if (!this.form.valid) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.maintenanceDate) {
      dataForm.maintenanceDate = dataForm.maintenanceDate.split('/').reverse().join('-');
    }
    if (dataForm.maintenanceNextDate) {
      dataForm.maintenanceNextDate = dataForm.maintenanceNextDate.split('/').reverse().join('-');
    }
    if (dataForm.maintenancePreviousDateFinished) {
      dataForm.maintenancePreviousDateFinished = dataForm.maintenancePreviousDateFinished.split('/').reverse().join('-');
    }
    this.maintenanceService.createMaintenance(dataForm as Maintenance).subscribe({
      next: (maintenance) => {
        this.maintenance.set(maintenance);
        this.snackBar.open('Manutenção cadastrada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/maintenance']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar manutenção:', error);
        this.snackBar.open('Erro ao cadastrar manutenção ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateMaintenance() {
    if (!this.maintenance()) {
      this.form.markAllAsTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }
    const id = this.maintenance()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.maintenanceDate) {
      dataForm.maintenanceDate = dataForm.maintenanceDate.split('/').reverse().join('-');
    }
    if (dataForm.maintenanceNextDate) {
      dataForm.maintenanceNextDate = dataForm.maintenanceNextDate.split('/').reverse().join('-');
    }
    if (dataForm.previsionDateFinish) {
      dataForm.previsionDateFinish = dataForm.previsionDateFinish.split('/').reverse().join('-');
    }
    this.maintenanceService.updateMaintenance(id, dataForm as Maintenance).subscribe({
      next: (maintenance) => {
        this.maintenance.set(maintenance);
        this.snackBar.open('Manutenção atualizada com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/maintenance']);
      },
      error: (error) => {
        console.error('Erro ao atualizar manutenção:', error);
        this.snackBar.open('Erro ao atualizar manutenção ' + error.message, 'Fechar', { duration: 3000 });
      }
    });
  }
  salvar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      
      this.validateForm();
      return;
    }
    if (this.update()) {
      this.updateMaintenance();
    } else {
      this.createMaintenance();
    }
  }

  private validateForm() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      if (this.form.get('vehicleId')?.errors?.['required']) {
        this.snackBar.open('Veículo é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('supplierId')?.errors?.['required']) {
        this.snackBar.open('Fornecedor é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('services')?.errors?.['required']) {
        this.snackBar.open('Serviço é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceDate')?.errors?.['required']) {
        this.snackBar.open('Data da manutenção é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceCost')?.errors?.['required']) {
        this.snackBar.open('Custo da manutenção é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceNextDate')?.errors?.['required']) {
        this.snackBar.open('Data da próxima manutenção é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceNextDate')?.errors?.['minDate']) {
        this.snackBar.open('Data da próxima manutenção deve ser maior ou igual a data de manutenção', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceNextKilometers')?.errors?.['min']) {
        this.snackBar.open('Quilometragem da próxima manutenção deve ser maior que 0', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceNextKilometers')?.errors?.['min']) {
        this.snackBar.open('Quilometragem da próxima manutenção deve ser maior que 0', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenancePreviousDateFinished')?.errors?.['required']) {
        this.snackBar.open('Data da próxima manutenção é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenancePreviousDateFinished')?.errors?.['minDate']) {
        this.snackBar.open('Data de previsão de termino da manutenção deve ser maior ou igual a data de manutenção', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceKilometers')?.errors?.['required']) {
        this.snackBar.open('Quilometragem da manutenção é obrigatório', 'Fechar', { duration: 3000 });
        return;
      }
      if (this.form.get('maintenanceKilometers')?.errors?.['min']) {
        this.snackBar.open('Quilometragem da manutenção deve ser maior que 0', 'Fechar', { duration: 3000 });
        return;
      }
      
    }
  }
  async getVehicles() {
    this.vehicles$.set(this.vehicleService.getAllVehicles(0, 10000).pipe(map((vehicles) => vehicles.data as Vehicle[])));
  }
  async getSuppliers() {
    this.suppliers$.set(this.supplierService.getAllSuppliers(SupplierType.MECHANIC, 0, 1000).pipe(map((suppliers) => suppliers.data as Supplier[])));
  }
  async getServices() {
    this.services$.set(this.maintenanceTypeService.getAllMaintenanceTypes(0, 1000).pipe(map((maintenanceServices) => maintenanceServices.data as MaintenanceServiceModel[])));
  }
  private validateMaintenanceNextDate() {
    return (control: AbstractControl) => {
      const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
      const value = control.value;
      if (!value) {
        return null;
      }
      if (!regexData.test(value)) return { invalidDate: true };
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      const validaData = this.form.get('maintenanceDate')?.value;

      if (!regexData.test(validaData)) {
        this.snackBar.open('Data de manutenção inválida', 'Fechar', { duration: 3000 });
        return { minDate: true };
      } 

      const [dayMaintenance, monthMaintenance, yearMaintenance] = validaData.split('/').map(Number);
      const maintenanceDate = new Date(yearMaintenance, monthMaintenance - 1, dayMaintenance);

      maintenanceDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);            
      if (date < maintenanceDate) {
        return { minDate: true };
      }
      return null;
    };
  }
  triggerMaintenanceNextDate() {
    this.form.get('maintenanceNextDate')?.updateValueAndValidity();
    this.form.get('maintenancePreviousDateFinished')?.updateValueAndValidity();
  }
}
