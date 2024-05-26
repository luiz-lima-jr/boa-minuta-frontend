import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { IndicadorDesempenhoFreteService } from "src/app/services/relatorio/indicador-desempenho-frete.service";
import { BaseRelatorioComponent } from "../base-relatorio.component";


@Component({
  selector: 'app-indicador-desempenho-fretes',
  templateUrl: './indicador-desempenho-fretes.component.html',
  styleUrls: ['./indicador-desempenho-fretes.component.scss']
})
export class IndicadorDesempenhoFretesComponent extends BaseRelatorioComponent implements OnInit {  

  displayedColumns: string[] = ['responsavel', 'cargas','m3', 'fretes',  'complemento', 'fretePago',  'somaImpostos', 'pedagio']

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
