import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { Driver } from '../models/driver';

@Injectable({
  providedIn: 'root',
})
export class VehicleStateService {
  // Um sinal privado para guardar o veículo selecionado
  private _selectedVehicle = signal<Vehicle | null>(null);
  private _selectedDriver = signal<Driver | null>(null);

  // Exposição pública apenas para leitura
  readonly selectedVehicle = this._selectedVehicle.asReadonly();
  readonly selectedDriver = this._selectedDriver.asReadonly();
  setVehicle(veiculo: Vehicle | null) {
    this._selectedVehicle.set(veiculo);
  }
  setDriver(driver: Driver | null) {
    this._selectedDriver.set(driver);
  }
}
