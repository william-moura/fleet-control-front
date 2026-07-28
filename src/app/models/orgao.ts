import { Prefeitura } from "./prefeitura";
import { Secretaria } from "./secretaria";

export interface Orgao {
    id: string;
    nome: string;
    sigla: string;
    // secretarias: Secretaria[];
    prefeitura: Prefeitura;
}
