import { Filial } from "./filial.model";

export class CargaFilter {
    semPlaca: boolean;
    comPlaca: boolean;
    faturadas: boolean;
    dataInicioFaturamento: Date;
    dataFimFaturamento: Date;
    filiais: Filial[];
    todasFiliais: boolean;
}