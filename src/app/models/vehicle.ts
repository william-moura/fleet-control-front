import { Driver } from "./driver";

export interface Vehicle {
  id: number;
  vehiclePlate: string;
  brand: string;
  vehicleModel: string;
  vehicleYear: number;
  fuelType: string;
  vehicleTankCapacity: number;
  vehicleCurrentMileage: number;
  vehiclePurchaseDate: Date;
  vehicleNotes: string;
  vehicleStatus: 'Ativo' | 'Inativo' | 1 | 0 | '1' | '0';
  drivers: Driver[];
}
