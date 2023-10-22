import { Caminhao } from "./caminhao.model";
import { Carga } from "./carga.model";
import { Filial } from "./filial.model";

export class Frete extends Carga {
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
    OUTRO = 'OUTRO'
}
