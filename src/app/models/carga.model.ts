import { Caminhao } from "./caminhao.model";
import { Filial } from "./filial.model";

export class Carga {
    dataSaida: Date;
    numeroCarga: number;
    placa: string;
    valorCarga: number;
    m3: number;
    nfse: number;
    filial: Filial;
    responsavel: string;
    faturado: boolean;
    destino: string;
    cliente: string;
    caminhao: Caminhao;
    volumes: number;
    dataLimiteCarregamento: Date;
    dataLiberacaoFaturamento: Date;
    dataImpressaoMinuta: Date;
    paletizado: boolean;
    observacoes: string;
}