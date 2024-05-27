import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ExperienciaBomEnum, ExperienciaBomEnumMapping } from "src/app/models/frete.model";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { DreService } from "src/app/services/relatorio/dre.service";
import { BaseRelatorioComponent } from "../base-relatorio.component";


@Component({
  selector: 'app-dre',
  templateUrl: './dre.component.html',
  styleUrls: ['./dre.component.scss']
})
export class DreComponent extends BaseRelatorioComponent implements OnInit {  

  displayedColumns: string[] = ['responsavel', 'placa','experiencia']
  experienciaList = Object.values(ExperienciaBomEnum);
  experienciaBomEnumMapping = ExperienciaBomEnumMapping;
  anos: number[];
  constructor(activatedRoute: ActivatedRoute,  location: Location, 
            filialService: FilialService, formBuilder: FormBuilder, alertService: AlertService, 
            private dreService: DreService) {
    super(activatedRoute, location, filialService, formBuilder, dreService, alertService);
  }

  override ngOnInit(): void {    
    super.ngOnInit();
    this.initFilterForm();
    this.getAnos();
    this.pesquisar();
  }
  
  initFilterForm(){
    this.formFilter = this.formBuilder.group({
      dataInicioFaturamento: [undefined],
      dataFimFaturamento: [undefined],
      filiais: [undefined],
      anoExercicio: [undefined]
    });
    this.formFilter.valueChanges.subscribe(res => this.pesquisar());
  }

  getAnos(){
    this.dreService.getAnos().subscribe(anos => this.anos = anos);
  }

  format(valor: number){
    return valor === 0 ? '' : valor
  }

}
