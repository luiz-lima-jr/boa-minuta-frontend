export class RelatorioCaptacaoCaminhoneiroModel {
    list: CaptacaoCaminhoneiroModel[];
    novoParaCarregamento: number;
    carregaSempre: number;
    retornando: number;
}

export class CaptacaoCaminhoneiroModel {
    responsavel: string;
    placa: string;
    experiencia: string;
}