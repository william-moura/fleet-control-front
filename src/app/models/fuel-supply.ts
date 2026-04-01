import { Driver } from "./driver";
import { FuelType } from "./fuel-type";
import { Vehicle } from "./vehicle";

export interface FuelSupply {
    id: number;
    vehicleId: number;
    fuelTypeId: number;
    driverId: number;
    fuelSupplierPrice: number;
    fuelSupplierDate: Date;
    fuelPrice: number;
    fuelSupplierQuantity: number;
    fuelSupplierTotal: number;
    fuelSupplierInvoiceNumber: string;
    fuelSupplierNotes: string;
    fuelType: FuelType;
    vehicle: Vehicle;
    driver: Driver;
    fuelSupplierStatus: 'Ativo' | 'Inativo' | 1 | 0 | '1' | '0';
    fuelSupplierKilometer: number;
    
}
