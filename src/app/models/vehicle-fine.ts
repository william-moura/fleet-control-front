import { Driver } from "./driver";
import { Vehicle } from "./vehicle";

export interface VehicleFine {
    id: number;
    vehicle?: Vehicle | null;
    driver?: Driver | null;
    fineDate: Date;
    fineAmount: number;
    fineStatus: '1' | '2' | '0' | 'pendente' | 'pago' | 'cancelado';
    fineLevel: 'leve' | 'media' | 'grave' | 'gravissima';
    finePaidDate: Date;
    fineNotes: string;
    finePoints: number;
}
