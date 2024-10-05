import { Filial } from "./filial.model";
import { Usuario } from "./usuario-cadastro.model";

export class FreteFilter {
    lancadas: boolean;
    faturadas: boolean;
    dataInicioFaturamento: Date;
    dataFimFaturamento: Date;
    filiais: Filial[];
    responsaveis: Usuario[];
    todasFiliais: boolean;
    numeroCarga?: Number;
    pagina?: number;
    qtdPagina?: number;
}