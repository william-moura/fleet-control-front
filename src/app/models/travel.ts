export interface Travel {
  id: number;
  vehicle: string;
  driver: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  status: string;
}
