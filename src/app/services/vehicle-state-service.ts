import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root',
})
export class VehicleStateService {
  // Um sinal privado para guardar o veículo selecionado
  private _selectedVehicle = signal<Vehicle | null>(null);

  // Exposição pública apenas para leitura
  readonly selectedVehicle = this._selectedVehicle.asReadonly();

  setVehicle(veiculo: Vehicle | null) {
    this._selectedVehicle.set(veiculo);
  }
}
