import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AsyncSelect } from '../../components/async-select/async-select';
import { Driver } from '../../models/driver';
import { Orgao } from '../../models/orgao';
import { Prefeitura } from '../../models/prefeitura';
import { Secretaria } from '../../models/secretaria';
import { Travel } from '../../models/travel';
import { Vehicle } from '../../models/vehicle';
import { PrefeituraService } from '../../services/prefeitura-service';
import { VehicleService } from '../../services/vehicle-service';

@Component({
  selector: 'app-add-update-travel',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    AsyncSelect,
  ],
  templateUrl: './add-update-travel.html',
  styleUrl: './add-update-travel.scss',
})
export class AddUpdateTravel {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private prefeituraService = inject(PrefeituraService);
  private vehicleService = inject(VehicleService);
  private cdr = inject(ChangeDetectorRef);

  form: FormGroup;
  update = signal(false);
  loading = signal(false);
  travel = signal<Travel | null>(null);

  prefeituras$ = signal<Observable<Prefeitura[]>>(of([]));
  orgaos$ = signal<Observable<Orgao[]>>(of([]));
  secretarias$ = signal<Observable<Secretaria[]>>(of([]));
  vehicles$ = signal<Observable<Vehicle[]>>(of([]));
  drivers$ = signal<Observable<Driver[]>>(of([]));

  statusOptions = ['Agendada', 'Em andamento', 'Concluída', 'Cancelada'];

  constructor() {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      vehicleId: [null, Validators.required],
      driverId: [null, Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [null],
      status: ['Agendada', Validators.required],
      prefeituraId: ['', Validators.required],
      orgaoId: ['', Validators.required],
      secretariaId: ['', Validators.required],
      odometerDeparture: ['', Validators.required],
      odometerEntry: [null],
    });
  }

  ngOnInit() {
    this.update.set(false);
    this.getPrefeituras();
    this.getVehicles();

    this.form.get('prefeituraId')?.valueChanges.subscribe((prefeituraId) => {
      this.form.patchValue({ orgaoId: null, secretariaId: null }, { emitEvent: false });
      this.orgaos$.set(of([]));
      this.secretarias$.set(of([]));
      if (prefeituraId) {
        this.getOrgaos();
      }
    });

    this.form.get('orgaoId')?.valueChanges.subscribe((orgaoId) => {
      this.form.patchValue({ secretariaId: null }, { emitEvent: false });
      this.secretarias$.set(of([]));
      if (orgaoId) {
        this.getSecretarias();
      }
    });

    this.form.get('vehicleId')?.valueChanges.subscribe((vehicleId) => {
      this.form.patchValue({ driverId: null }, { emitEvent: false });
      this.drivers$.set(of([]));
      if (vehicleId) {
        this.getDrivers(vehicleId);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.update.set(true);
      this.form.patchValue({ id });
      // Integração com API de viagens pendente
    }
  }

  getPrefeituras() {
    this.prefeituraService.getPrefeituras(0, 1000).subscribe((prefeituras) => {
      this.prefeituras$.set(of(prefeituras.data));
      this.cdr.detectChanges();
    });
  }

  getOrgaos() {
    const prefeituraId = this.form.get('prefeituraId')?.value;
    if (!prefeituraId) {
      this.orgaos$.set(of([]));
      return;
    }

    this.prefeituraService.getOrgaosByPrefeituraId(prefeituraId).subscribe((orgaos) => {
      this.orgaos$.set(of(orgaos));
      this.cdr.detectChanges();
    });
  }

  getSecretarias() {
    const orgaoId = this.form.get('orgaoId')?.value;
    if (!orgaoId) {
      this.secretarias$.set(of([]));
      return;
    }

    this.prefeituraService.getSecretariaByOrgaoId(orgaoId).subscribe((secretarias) => {
      this.secretarias$.set(of(secretarias));
      this.cdr.detectChanges();
    });
  }

  getVehicles() {
    this.vehicles$.set(
      this.vehicleService.getAllVehicles(0, 10000).pipe(map((vehicles) => vehicles.data as Vehicle[]))
    );
  }

  getDrivers(vehicleId: number) {
    if (!vehicleId) {
      this.drivers$.set(of([]));
      return;
    }

    this.drivers$.set(
      this.vehicleService.getDriversByVehicleId(vehicleId).pipe(map((drivers) => drivers as Driver[]))
    );
  }

  cancelar() {
    this.router.navigate(['/travels']);
  }

  salvar() {
    if (this.form.get('vehicleId')?.errors?.['required']) {
      this.snackBar.open('Veículo é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('driverId')?.errors?.['required']) {
      this.snackBar.open('Motorista é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('origin')?.errors?.['required']) {
      this.snackBar.open('Origem é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('destination')?.errors?.['required']) {
      this.snackBar.open('Destino é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('departureDate')?.errors?.['required']) {
      this.snackBar.open('Data de saída é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('status')?.errors?.['required']) {
      this.snackBar.open('Status é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('prefeituraId')?.errors?.['required']) {
      this.snackBar.open('Prefeitura é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('orgaoId')?.errors?.['required']) {
      this.snackBar.open('Órgão é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('secretariaId')?.errors?.['required']) {
      this.snackBar.open('Secretaria é obrigatória', 'Fechar', { duration: 3000 });
      return;
    }
    if (this.form.get('odometerDeparture')?.errors?.['required']) {
      this.snackBar.open('Odômetro de saída é obrigatório', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.update()) {
      this.snackBar.open('Viagem atualizada com sucesso', 'Fechar', { duration: 3000 });
    } else {
      this.snackBar.open('Viagem criada com sucesso', 'Fechar', { duration: 3000 });
    }
    this.router.navigate(['/travels']);
  }
}
