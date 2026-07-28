import { Orgao } from "./orgao";

export interface Secretaria {
    id: string;
    nome: string;
    responsavel: string;
    email: string;
    orgao: Orgao;
}
