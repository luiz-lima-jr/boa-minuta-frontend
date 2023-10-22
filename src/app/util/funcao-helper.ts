import { ADMINISTRADOR, FATURISTA, OPERACIONAL } from "../models/funcao.model";
import { SessionProfile } from "../models/session-profile.model"

export const possuiFuncaoAcesso = (funcoes: string[], funcoesCurrent: string[]) : boolean => {
    return funcoesCurrent.filter(r => funcoes.includes(r)).length > 0;
}

export const isFaturista = (session: SessionProfile) => {
    return session?.funcoes?.filter(r => r === FATURISTA).length > 0;
}

export const isAdm = (session: SessionProfile) => {
    return session?.funcoes?.filter(r => r === ADMINISTRADOR).length > 0;
}

export const isOperacional = (session: SessionProfile) => {
    return session?.funcoes?.filter(r => r === OPERACIONAL).length > 0;
}