import { Estado } from "./estado.model";
import { Filial } from "./filial.model";

export class Aliquota {
    id: number;
    estadoOrigem: Estado;
    estadoDestino: Estado;
    filial: Filial;
    aliquota: number;
}