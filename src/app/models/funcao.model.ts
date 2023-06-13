export class Funcao {
    id: number;
    descricao: FuncaoType;
}

export const ADMINISTRADOR = 'ADMINISTRADOR';
export const OPERACIONAL = 'OPERACIONAL';
export const FATURISTA = 'FATURISTA';

export type FuncaoType = 'ADMINISTRADOR' | 'OPERACIONAL' | 'FATURISTA'