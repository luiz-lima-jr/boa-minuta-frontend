import { Caminhao } from "../models/caminhao.model";
import { Estado } from "../models/estado.model";
import { Filial } from "../models/filial.model";
import { ExperienciaBomEnum, FobCifEnum, PagamentoPedagioEnum } from "../models/frete.model";
import { Funcao } from "../models/funcao.model";
import { Municipio } from "../models/municipio.model";
import { TipoAliquota } from "../models/tipo-aliquota.model";
import { Usuario } from "../models/usuario-cadastro.model";

export const compareTipoAliquota = (f1: TipoAliquota, f2: TipoAliquota): boolean => {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
}
export const compareEstado = (f1: Estado, f2: Estado): boolean => {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
}
export const compareMunicipio = (f1: Municipio, f2: Municipio): boolean => {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
}


export const compareFilial = (f1: Filial, f2: Filial): boolean => {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
}

export const   compareFuncoes = (f1: Funcao, f2: Funcao): boolean => {
  return f1 && f2 ? f1.id === f2.id : f1 === f2;
}

export const   compareExperienciaBom = (f1: ExperienciaBomEnum, f2: ExperienciaBomEnum): boolean => {
  return f1 === f2;
}

export const   compareFobCif = (f1: FobCifEnum, f2: FobCifEnum): boolean => {
  return f1 === f2;
}

export const   comparePagamentoPedagio = (f1: PagamentoPedagioEnum, f2: PagamentoPedagioEnum): boolean => {
  return f1 === f2;
}
export const   compareUsuario = (f1: Usuario, f2: Usuario): boolean => {
  return f1 === f2;
}
export const   compareCaminhao = (f1: Caminhao, f2: Caminhao): boolean => {
  return f1 === f2;
}