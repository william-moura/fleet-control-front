import { MaintenanceServiceModel } from "./maintenance-service-model";
import { Vehicle } from "./vehicle";

export interface Maintenance {
  id: number;
  vehicleId: number;  
  description: string;
  maintenanceDate: string;
  maintenanceCost: number;
  maintenanceStatus: string;
  services: MaintenanceServiceModel[];
  vehicle: Vehicle;
  servicesFormatted?: string;
  maintenanceNextDate?: string;
  maintenanceKilometers?: number;
  previsionDateFinish?: string;
  maintenanceNextKilometers?: number;
  maintenancePreviousDateFinished?: string;
}
