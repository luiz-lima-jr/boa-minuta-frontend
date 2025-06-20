import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Frete } from "src/app/models/frete.model";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { MargemOperacionalService } from "src/app/services/relatorio/margem-operacional.service";
import { BaseRelatorioComponent } from "../base-relatorio.component";

@Component({
  selector: 'app-margem-operacional',
  templateUrl: './margem-operacional.component.html',
  styleUrls: ['./margem-operacional.component.scss']
})
export class MargemOperacionalComponent extends BaseRelatorioComponent implements OnInit {  

  displayedColumns: string[] = ['numeroCarga', 'responsavel', 'origem','destino', 'frete', 
    'fretePago', 'custos', 'saldo', 'margem', 'markup'];
    tableFooterColumns: string[] = ['total', 'frete']// 'totalFretePago', 'totalCustos', 'totalSaldo'];

  constructor(activatedRoute: ActivatedRoute,  location: Location, 
              filialService: FilialService, formBuilder: FormBuilder, 
              private margemService: MargemOperacionalService, alertService: AlertService) {
    super(activatedRoute, location, filialService, formBuilder, margemService, alertService);
  }

  override ngOnInit(): void {    
    super.ngOnInit();
    super.ngOnInit()
    this.initFilterForm();
    this.pesquisar();
  }
  
  initFilterForm(){
    this.formFilter = this.formBuilder.group({
      responsaveis: [undefined],
      margemDesejada: [undefined],
      dataInicioFaturamento: [undefined],
      dataFimFaturamento: [undefined],
      filiais: [undefined]
    });
    this.formFilter.valueChanges.subscribe(res => this.pesquisar());
  }

  destacarLabelMargem(frete: Frete){
    const filtro = this.formFilter.controls['margemDesejada'].value;
    return filtro && filtro >= frete.margem;
  }

}
