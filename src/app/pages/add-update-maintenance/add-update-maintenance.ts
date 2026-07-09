import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    NgxMaskDirective],
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
        this.form.patchValue(maintenance);
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
    if (dataForm.previsionDateFinish) {
      dataForm.previsionDateFinish = dataForm.previsionDateFinish.split('/').reverse().join('-');
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
        this.snackBar.open('Erro ao cadastrar manutenção', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Erro ao atualizar manutenção', 'Fechar', { duration: 3000 });
      }
    });
  }
  salvar() {
    if (this.update()) {
      this.updateMaintenance();
    } else {
      this.createMaintenance();
    }
  }
}
