import { Caminhao } from "./caminhao.model";
import { Filial } from "./filial.model";
import { Municipio } from "./municipio.model";
import { Usuario } from "./usuario-cadastro.model";

export class Frete {
    id?: number;
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
    origem: string;
    pedagio: number;
    complementoCalculo: number;
    descontos: number;
    frete: number;
    fobCif: FobCifEnum;
    pagamentoPedagio: PagamentoPedagioEnum;
    fretePago: number;
    iss: number;
    pisCofins: number;
    icms: number;
    custos: number;
    irCs: number;
    saldo: number;
    margem: number;
    markup: number;
    responsavelOperacional: Usuario;
    responsavelFaturamento: Usuario;
    entregas: number;
    municipioOrigem: Municipio;
    municipioDestino: Municipio;
}

export enum ExperienciaBomEnum {
    NOVO_PARA_CARREGAMENTO = 'NOVO_PARA_CARREGAMENTO',
    CARREGA_SEMPRE = 'CARREGA_SEMPRE',
    RETORNANDO = 'RETORNANDO'
}

export const ExperienciaBomEnumMapping: Record<ExperienciaBomEnum, string> = {
   [ExperienciaBomEnum.NOVO_PARA_CARREGAMENTO]: 'Novo para Carregamento',
   [ExperienciaBomEnum.CARREGA_SEMPRE]: 'Carrega Sempre',
   [ExperienciaBomEnum.RETORNANDO]: 'Retornando'
}

export enum FobCifEnum{
    FOB = 'FOB',
    CIF = 'CIF'
}

export enum PagamentoPedagioEnum {
    TAG = 'TAG',
    CARTAO = 'CARTAO',
    OUTRO = 'OUTRO',
    SEM_PEDAGIO='SEM_PEDAGIO'
}
