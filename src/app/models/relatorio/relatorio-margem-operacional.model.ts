import { BaseRelatorioModel } from "./base-relatorio.model";

export class RelatorioMargemOperacionalModel extends BaseRelatorioModel {
    totalFrete: number;
    totalFretePago: number;
    totalCustos: number;
    totalSaldo: number;
}