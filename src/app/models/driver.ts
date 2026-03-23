export interface Driver {
  id: number;
  driverRegisteredNumber: string;
  driverName: string;
  driverAddress: string;
  driverCity: string;
  driverState: string;
  driverZipCode: string;
  driverBloodType: string;
  driverRg: string;
  driverCpf: string;
  driverLicenseNumber: string;
  driverLicenseExpirationDate: Date;
  driverLicenseCategory: string;
  driverBirthDate: Date;
  driverPhone: string;
  driverStatus: 'Ativo' | 'Inativo' | 1 | 0 | '1' | '0';
}
