import { FuelSupply } from "./fuel-supply";
import { Maintenance } from "./maintenance";

export interface Dashboard {
    vehicleCount: number;
    mediaConsumption: number;
    totalCost: number;
    recentFuelSupplies: FuelSupply[] | null;
    recentMaintenances: Maintenance[] | null;
}
