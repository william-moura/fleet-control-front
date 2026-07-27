import { Orgao } from "./orgao";
import { Photo } from "./photo";

export interface Prefeitura {
    id: string;
    razaoSocial: string;
    nomeFantasia: string;
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
    photos: Photo[] | null;
}
