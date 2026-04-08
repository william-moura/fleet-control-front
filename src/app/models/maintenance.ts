import { MaintenanceServiceModel } from "./maintenance-service-model";
import { Vehicle } from "./vehicle";

export interface Maintenance {
  id: number;
  vehicleId: number;  
  description: string;
  maintenanceDate: Date;
  maintenanceCost: number;
  maintenanceStatus: string;
  services: MaintenanceServiceModel[];
  vehicle: Vehicle;
}
