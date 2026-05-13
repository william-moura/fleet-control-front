import { FuelSupply } from "./fuel-supply";
import { Maintenance } from "./maintenance";
import { EvolutionExpenses } from "./evolution-expenses";
import { VehicleFine } from "./vehicle-fine";

export interface Dashboard {
    vehicleCount: number;
    mediaConsumption: number;
    totalCost: number;
    recentFuelSupplies: FuelSupply[] | null;
    recentMaintenances: Maintenance[] | null;
    evolutionExpenses: EvolutionExpenses;
    recentFines: VehicleFine[] | null;
}
