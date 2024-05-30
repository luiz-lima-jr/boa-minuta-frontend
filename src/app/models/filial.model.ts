import { Municipio } from "./municipio.model";

export class Filial {
    id: number;
    nome: string;
    codigoMili?: string;
    codigoCarregamento?: number;
    municipio?: Municipio;
}