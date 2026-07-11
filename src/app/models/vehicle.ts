import { Driver } from "./driver";
import { FuelSupply } from "./fuel-supply";
import { Maintenance } from "./maintenance";
import { Photo } from "./photo";
import { VehicleFine } from "./vehicle-fine";

export interface Vehicle {
  id: number;
  vehiclePlate: string;
  brand: string;
  vehicleModel: string;
  vehicleYear: number;
  fuelType: string;
  vehicleTankCapacity: number;
  vehicleCurrentMileage: number;
  vehiclePurchaseDate: string | Date;
  vehicleNotes: string;
  vehicleStatus: 'Ativo' | 'Inativo' | 1 | 0 | '1' | '0';
  drivers: Driver[];
  photos: Photo[];
  totalKilometersCost: number;
  vehicleModelYear: number;
  vehicleTransmissionType: string;
  vehicleColor: string;
  vehicleChassisNumber: string;
  vehicleRenavamNumber: string;
  fuelTypeId: number;
  maintenances: Maintenance[] | null;
  fines: VehicleFine[] | null;
  fuelSupply: FuelSupply[] | null;
}
