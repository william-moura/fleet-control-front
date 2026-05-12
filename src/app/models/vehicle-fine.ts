import { Driver } from "./driver";
import { Vehicle } from "./vehicle";

export interface VehicleFine {
    id: number;
    vehicle: Vehicle;
    driver: Driver;
    fineDate: Date;
    fineAmount: number;
    fineStatus: 'Pendente' | 'Pago' | 'Cancelado';
    fineType: 'Leve' | 'Média' | 'Grave' | 'Gravíssima';
    fineDueDate: Date;
    fineNotes: string;
}
