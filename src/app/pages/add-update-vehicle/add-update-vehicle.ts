import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../models/vehicle';
import { VehicleStateService } from '../../services/vehicle-state-service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { VehicleHistory } from '../../models/vehicle-history';
import { VehicleService } from '../../services/vehicle-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Maintenance } from '../../models/maintenance';
import { FuelSupply } from '../../models/fuel-supply';
import { MaintenanceService } from '../../services/maintenance-service';
import { FuelSupplyService } from '../../services/fuel-supply-service';
import { ListFuelSuppliers } from '../../components/list-fuel-suppliers/list-fuel-suppliers';
import { ListMaintenance } from '../../components/list-maintenance/list-maintenance';
@Component({
  selector: 'app-add-update-vehicle',
  imports: [
    CommonModule,
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
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,    
    ListFuelSuppliers,
    ListMaintenance
  ],
  templateUrl: './add-update-vehicle.html',
  styleUrl: './add-update-vehicle.scss',
})
export class AddUpdateVehicle {
  veiculoForm: FormGroup;
  veiculoDados: Vehicle | null = null;
  //veiculoDadoss = input<Vehicle | null>(null);
  update = signal(false);  
  private router = inject(Router);
  private vehicleStateService = inject(VehicleStateService);
  isLoading = signal(true);
  historico = signal<VehicleHistory[]>([]);
  private vehicleService = inject(VehicleService);
  maintenances = signal<Maintenance[]>([]);
  fuelSupplies = signal<FuelSupply[]>([]);
  private maintenanceService = inject(MaintenanceService);
  private fuelSupplyService = inject(FuelSupplyService);
  ngOnInit() {
    const veiculoDadoss = this.vehicleStateService.selectedVehicle();
    console.log(veiculoDadoss, 'selectedVehicle');        
    if (veiculoDadoss) {
      this.update.set(true);
      this.veiculoDados = veiculoDadoss;
      this.veiculoForm.patchValue(veiculoDadoss);
      this.vehicleService.getVehicleHistory(this.veiculoDados?.id).subscribe({
        next: (history: VehicleHistory[]) => {
          this.historico.set(history);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao buscar histórico do veículo:', error);
          this.isLoading.set(false);
        }
      });
      this.maintenanceService.getMaintenancesByVehicleId(this.veiculoDados?.id).subscribe({
        next: (maintenances: Maintenance[]) => {
          this.maintenances.set(maintenances);          
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao buscar manutenções do veículo:', error);
          this.isLoading.set(false);
        }
      });
      this.fuelSupplyService.getFuelSuppliesByVehicleId(this.veiculoDados?.id).subscribe({
        next: (fuelSupplies: FuelSupply[]) => {
          this.fuelSupplies.set(fuelSupplies);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erro ao buscar abastecimentos do veículo:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.update.set(false);
    }
  }
  // Mock de dados para simular o preenchimento da tela
  /*
  veiculoDados = {
    placa: 'EUF0F59',
    status: 'Ativo',
    marca: 'Fiat',
    modelo: 'Fastback',
    anoFabricacao: 2023,
    anoModelo: 2024,
    combustivel: 'Flex',
    cambio: 'Automático',
    cor: 'Cinza',
    orgao: 'Secretaria de Administração',
    centroCusto: 'Transporte Oficial',
    capacidadeCombustivel: 45,
    quilometragem: 12580,
    dataAquisicao: new Date(2023, 2, 15), // 15/03/2023
    renavam: '12345678901',
    chassi: '9BD3745B0R1234567',
    motorista: 'João Silva',
    telefoneMotorista: '(11) 99999-9999'
  };
  */
  constructor(private fb: FormBuilder) {
    this.veiculoForm = this.fb.group({
      vehiclePlate: ['', Validators.required],
      vehicleStatus: ['', Validators.required],
      brand: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', Validators.required],
      fuelType: ['', Validators.required],
      vehicleCurrentMileage: ['', Validators.required],
      vehiclePurchaseDate: ['', Validators.required],
      vehicleNotes: ['', Validators.required],
      vehicleTankCapacity: ['', Validators.required],
      vehicleTransmission: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      vehicleYearModel: ['', Validators.required],
      
    });
  }

  salvar() {
    if (this.veiculoForm.valid) {
      console.log('Dados salvos:', this.veiculoForm.value);
    }
  }

  cancelar() {
    console.log('Ação cancelada');
  }

  voltar() {
    this.router.navigate(['/vehicles']);
  }
}
