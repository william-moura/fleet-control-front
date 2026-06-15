import { Injectable, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { Driver } from '../models/driver';
import { VehicleFine } from '../models/vehicle-fine';
import { Kilometer } from '../models/kilometer';
import { Maintenance } from '../models/maintenance';
import { FuelSupply } from '../models/fuel-supply';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root',
})
export class VehicleStateService {
  // Um sinal privado para guardar o veículo selecionado
  private _selectedVehicle = signal<Vehicle | null>(null);
  private _selectedDriver = signal<Driver | null>(null);
  private _selectedVehicleFine = signal<VehicleFine | null>(null);
  private _selectedKilometer = signal<Kilometer | null>(null);
  private _selectedMaintenance = signal<Maintenance | null>(null);
  private _selectedFuelSupply = signal<FuelSupply | null>(null);
  private _selectedSupplier = signal<Supplier | null>(null);
  
  // Exposição pública apenas para leitura
  readonly selectedVehicle = this._selectedVehicle.asReadonly();
  readonly selectedDriver = this._selectedDriver.asReadonly();
  readonly selectedVehicleFine = this._selectedVehicleFine.asReadonly();
  readonly selectedKilometer = this._selectedKilometer.asReadonly();
  readonly selectedMaintenance = this._selectedMaintenance.asReadonly();
  readonly selectedFuelSupply = this._selectedFuelSupply.asReadonly();
  readonly selectedSupplier = this._selectedSupplier.asReadonly();
  setVehicle(veiculo: Vehicle | null) {
    this._selectedVehicle.set(veiculo);
  }
  setDriver(driver: Driver | null) {
    this._selectedDriver.set(driver);
  }
  setVehicleFine(vehicleFine: VehicleFine | null) {
    this._selectedVehicleFine.set(vehicleFine);
  }
  setKilometer(kilometer: Kilometer | null) {
    this._selectedKilometer.set(kilometer);
  }
  setMaintenance(maintenance: Maintenance | null) {
    this._selectedMaintenance.set(maintenance);
  }
  setFuelSupply(fuelSupply: FuelSupply | null) {
    this._selectedFuelSupply.set(fuelSupply);
  }
  setSupplier(supplier: Supplier | null) {
    this._selectedSupplier.set(supplier);
  }
}
