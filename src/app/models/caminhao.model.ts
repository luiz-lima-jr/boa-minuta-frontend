import { Motorista } from "./motorista.model";
import { PessoaTransporte } from "./pessoa-transporte.model";

export class Caminhao {
    id: number;
    placa: string;
    transportador: PessoaTransporte;
    motorista: Motorista;
    dataAlteracao: Date;
    motoristaDiferente: boolean;
}