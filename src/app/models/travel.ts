import { Driver } from './driver';
import { Vehicle } from './vehicle';

export interface Travel {
  id: number;
  vehicleId: number;
  driverId: number;
  vehicle?: Vehicle;
  driver?: Driver;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  status: string;
  prefeituraId: number;
  orgaoId: number;
  secretariaId: number;
  odometerDeparture: number;
  odometerEntry: number | null;
  distanciaKm: string;
  distanciaMetros: number;
  duracaoTexto: string;
}
