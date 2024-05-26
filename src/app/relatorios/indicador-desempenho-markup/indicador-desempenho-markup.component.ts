import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { IndicadorDesempenhoFreteService } from "src/app/services/relatorio/indicador-desempenho-frete.service";
import { BaseRelatorioComponent } from "../base-relatorio.component";


@Component({
  selector: 'app-indicador-desempenho-markup',
  templateUrl: './indicador-desempenho-markup.component.html',
  styleUrls: ['./indicador-desempenho-markup.component.scss']
})
export class IndicadorDesempenhoMarkupComponent extends BaseRelatorioComponent implements OnInit {  

  displayedColumns: string[] = ['responsavel', 'cargas','m3', 'fretes',  'markup']

  constructor(activatedRoute: ActivatedRoute,  location: Location, 
             filialService: FilialService, formBuilder: FormBuilder, alertService: AlertService, 
              private indicadorService: IndicadorDesempenhoFreteService) {
    super(activatedRoute, location, filialService, formBuilder, indicadorService, alertService);
  }

  override ngOnInit(): void {    
    super.ngOnInit();
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

}
