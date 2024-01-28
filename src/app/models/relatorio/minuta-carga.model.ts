import { Cliente } from "../cliente.model";
import { Pedido } from "../pedido.model";

export class MinutaCarga {
    
    numeroCarga: number;
    direto: string;
    placa: string;
    motorista: string;
    redespacho: string;
    dataSaida: Date;
    pesoBruto: number;
    valorTotal: number;
    dataFatura: Date;
    totalVolumes: number;
    icmsFrete: number;
    pedagio: number;
    cidades: number;
    entregas: number;
    taxaEntrega: number;
    volumeTotalCaminhao: number;
    volumeTotalCarga: number;
    valorFrete: number;
    observacoes: string;
    
    pedidos: Pedido[];
    clientes: Cliente[];

}