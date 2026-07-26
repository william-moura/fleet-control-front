import { Orgao } from "./orgao";

export interface Prefeitura {
    id: string;
    nome: string;
    cnpj: string;
    uf: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;    
    cep: string;
    telefone: string;
    email: string | null;
    site: string | null;
    orgaos: Orgao[];
    foto: string | null;
}
