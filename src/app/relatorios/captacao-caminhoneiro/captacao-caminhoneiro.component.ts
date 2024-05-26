import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ExperienciaBomEnum, ExperienciaBomEnumMapping } from "src/app/models/frete.model";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { CaptacaoCaminhoneiroService } from "src/app/services/relatorio/captacao-caminhoneiro.service";
import { compareExperienciaBom } from "src/app/util/compares";
import { BaseRelatorioComponent } from "../base-relatorio.component";


@Component({
  selector: 'app-captacao-caminhoneiro',
  templateUrl: './captacao-caminhoneiro.component.html',
  styleUrls: ['./captacao-caminhoneiro.component.scss']
})
export class CaptacaoCaminhoneiroComponent extends BaseRelatorioComponent implements OnInit {  

  displayedColumns: string[] = ['responsavel', 'placa','experiencia']
  experienciaList = Object.values(ExperienciaBomEnum);
  experienciaBomEnumMapping = ExperienciaBomEnumMapping;
  constructor(activatedRoute: ActivatedRoute,  location: Location, 
            filialService: FilialService, formBuilder: FormBuilder, alertService: AlertService, 
            private indicadorService: CaptacaoCaminhoneiroService) {
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
      dataInicioCadastro: [undefined],
      dataFimCadastro: [undefined],
      filiais: [undefined],
      experienciasBom: [undefined],
      pagina: [undefined], 
      qtdPagina: [undefined],
      coluna: [undefined],
      direcao: [undefined]
    });
    this.formFilter.valueChanges.subscribe(res => this.pesquisar());
  }
  
  paginaAlterada(event: any){
    this.formFilter.controls['pagina'].setValue(event.pageIndex);
    this.formFilter.controls['qtdPagina'].setValue(event.pageSize);

    this.pesquisar();
  }

  sortTable(event: any){
    this.formFilter.controls['coluna'].setValue(event.active);
    this.formFilter.controls['direcao'].setValue(event.direction);
    this.pesquisar();
  }

  compareExperienciaBom(f1: ExperienciaBomEnum, f2: ExperienciaBomEnum){
    return compareExperienciaBom(f1, f2)
  }
}
