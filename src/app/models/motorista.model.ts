import { ExperienciaBomEnum } from "./frete.model";
import { PessoaTransporte } from "./pessoa-transporte.model";

export class Motorista {
    id: number;
    pessoaTransporte: PessoaTransporte;
    experiencia: ExperienciaBomEnum;
}