import { PessoaTransporte } from "./pessoa-transporte.model";

export class Caminhao {
    id: number;
    placa: string;
    transportador: PessoaTransporte;
    motorista: PessoaTransporte;
    dataAlteracao: Date;
    habiliarCampoMotorista: boolean;
}