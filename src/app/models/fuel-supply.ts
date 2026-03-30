import { Driver } from "./driver";
import { FuelType } from "./fuel-type";
import { Vehicle } from "./vehicle";

export interface FuelSupply {
    id: number;
    vehicleId: number;
    fuelTypeId: number;
    driverId: number;
    fuelStationId: number;
    fuelDate: Date;
    fuelPrice: number;
    fuelQuantity: number;
    fuelTotal: number;
    fuelProofPayment: string;
    fuelNotes: string;
    fuelType: FuelType;
    vehicle: Vehicle;
    driver: Driver;
    
}
