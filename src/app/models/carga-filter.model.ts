import { Filial } from "./filial.model";
import { Usuario } from "./usuario-cadastro.model";

export class CargaFilter {
    semPlaca: boolean;
    comPlaca: boolean;
    faturadas: boolean;
    dataInicioFaturamento: Date;
    dataFimFaturamento: Date;
    filiais: Filial[];
    responsaveis: Usuario[];
    todasFiliais: boolean;
}