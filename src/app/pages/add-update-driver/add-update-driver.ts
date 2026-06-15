import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskDirective } from 'ngx-mask';
import { UppercaseDirective } from '../../uppercase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverService } from '../../services/driver-service';
import { Driver } from '../../models/driver';
import { CepService } from '../../services/cep-service';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { VehicleFineService } from '../../services/vehicle-fine-service';
import { VehicleFine } from '../../models/vehicle-fine';
import { ListDriverFine } from '../../components/list-driver-fine/list-driver-fine';

@Component({
  selector: 'app-add-update-driver',
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
    UppercaseDirective,
    ListDriverFine],
  templateUrl: './add-update-driver.html',
  styleUrl: './add-update-driver.scss',
})
export class AddUpdateDriver {
  private fb = inject(FormBuilder);
  private driverService = inject(DriverService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private driver = signal<Driver | null>(null);
  update = signal<boolean>(false);
  private cepService = inject(CepService);
  form: FormGroup;
  private driverStateService = inject(VehicleStateService);
  private vehicleFineService = inject(VehicleFineService);
  driverFines = signal<VehicleFine[]>([]);
  constructor() {
    this.form = this.fb.group({
      driverName: ['', Validators.required],
      driverRegisteredNumber: ['', Validators.required],
      driverAddress: ['', Validators.required],
      driverCity: ['', Validators.required],
      driverState: ['', Validators.required],
      driverZipCode: ['', Validators.required],
      driverBloodType: ['', Validators.required],
      driverRg: ['', Validators.required],
      driverCpf: ['', [Validators.required, this.validateCpf]],
      driverLicenseNumber: ['', Validators.required],
      driverLicenseExpirationDate: ['', Validators.required],
      driverLicenseCategory: ['', Validators.required],
      driverBirthDate: ['', Validators.required],
      driverPhone: ['', Validators.required],
      driverStatus: ['', Validators.required],
    });
  }
  private validateCpf(control: AbstractControl) {
    const cpf = control.value;
    if (cpf.length !== 11) {
      return { invalidCpf: true };
    }
    return null;
  }
  getCep(cep: string) {
    this.cepService.getCep(cep).subscribe((cep) => {
      this.form.patchValue({
        driverAddress: cep.street,
        driverCity: cep.city,
        driverState: cep.state,        
        driverNeighborhood: cep.neighborhood,
      });
    });
  }
  salvar() {
    if (this.form.valid) {
      if (this.update()) {
        this.updateDriver();
      } else {
        this.createDriver();
      }
    }
  }
  cancelar() {
    this.clearForm();
    this.router.navigate(['/drivers']);
  }
  voltar() {
    this.clearForm();
    this.router.navigate(['/drivers']);
  }
  ngOnInit() {
    this.driver.set(this.driverStateService.selectedDriver());
    console.log(this.driver(), 'driver');
    if (this.driver()) {
      const driverId = this.driver()?.id;
      if (!driverId) {
        return;
      }
      this.update.set(true);
      this.vehicleFineService.getVehicleFinesByDriverId(driverId).subscribe((vehicleFines) => {
        console.log(vehicleFines, 'vehicleFines');
        this.driverFines.set(vehicleFines);
      });
      const dataForm = { ...this.driver() };
      if (dataForm.driverLicenseExpirationDate) {
        dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('-').reverse().join('/');
      }
      if (dataForm.driverBirthDate) {
        dataForm.driverBirthDate = dataForm.driverBirthDate.split('-').reverse().join('/');
      }
      this.form.patchValue({ ...dataForm });
    } else {
      this.update.set(false);
    }
  }
  private clearForm() {
    this.form.patchValue({});
    this.driver.set(null);
    this.update.set(false);
    this.driverStateService.setDriver(null);
  }
  private createDriver() {
    const dataForm = { ...this.form.value };
    if (dataForm.driverLicenseExpirationDate) {
      dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('/').reverse().join('-');
    }
    if (dataForm.driverBirthDate) {
      dataForm.driverBirthDate = dataForm.driverBirthDate.split('/').reverse().join('-');
    }
    this.driverService.createDriver(dataForm).subscribe({
      next: (driver) => {
      this.snackBar.open('Motorista cadastrado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/drivers']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar motorista:', error);
        this.snackBar.open('Erro ao cadastrar motorista', 'Fechar', { duration: 3000 });
      }
    });
  }
  private updateDriver() {
    const id = this.driver()?.id;
    if (!id) {
      return;
    }
    const dataForm = { ...this.form.value };
    if (dataForm.driverLicenseExpirationDate) {
      dataForm.driverLicenseExpirationDate = dataForm.driverLicenseExpirationDate.split('/').reverse().join('-');
    }
    if (dataForm.driverBirthDate) {
      dataForm.driverBirthDate = dataForm.driverBirthDate.split('/').reverse().join('-');
    }
    this.driverService.updateDriver(id, dataForm).subscribe({
      next: (driver) => {
        this.snackBar.open('Motorista atualizado com sucesso', 'Fechar', { duration: 3000 });
        this.clearForm();
        this.router.navigate(['/drivers']);
      },
      error: (error) => {
        console.error('Erro ao atualizar motorista:', error);
        this.snackBar.open('Erro ao atualizar motorista', 'Fechar', { duration: 3000 });
      }
    });
  }
}
