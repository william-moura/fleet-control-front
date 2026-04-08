import { SupplierType } from "./supplier-type";

export interface Supplier {
    id: number;
    supplierFantasyName: string;
    supplierCompanyName: string;
    supplierCnpj: string;
    supplierAddress: string;
    supplierCity: string;
    supplierState: string;
    supplierZipCode: string;
    supplierPhone: string;
    supplierEmail: string;
    supplierStatus: 'Ativo' | 'Inativo' | 1 | 0 | '1' | '0';
    supplierType: SupplierType;
}
