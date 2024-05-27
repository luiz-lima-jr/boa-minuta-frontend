import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { FreteFilter } from "../models/carga-filter.model";
import { Filial } from "../models/filial.model";
import { Usuario } from "../models/usuario-cadastro.model";
import { AlertService } from "../services/alert.service";
import { FilialService } from "../services/filial.service";
import { BaseRelatorioService } from "../services/relatorio/base-relatorio-service.service";
import { compareFilial, compareUsuario } from "../util/compares";
import { CheckAllFiliais, CheckAllUsuario } from "../util/select";

@Component({
    template: ''
  })
export abstract class BaseRelatorioComponent implements OnInit{
    
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  resultsLength = 0
  formFilter: FormGroup;
  filiais: Filial[] = [];
  responsaveis: Usuario[] = [];
  result: any;

    constructor(protected activatedRoute: ActivatedRoute,  protected location: Location, 
        protected filialService: FilialService, protected formBuilder: FormBuilder, 
        protected relatorioService: BaseRelatorioService,   private alertService: AlertService) {
    }

    ngOnInit(): void {        
        this.buscarFiliais();
        this.buscarResponsaveis();
    }

    
  checkAllFiliais(filial: Filial){
    const filter = this.formFilter.getRawValue() as FreteFilter;
    filter.filiais = CheckAllFiliais(filial, this.filiais, this.formFilter);
    this.formFilter.patchValue(filter);
  }

  checkAllUsuario(usuario: Usuario){
    const filter = this.formFilter.getRawValue() as FreteFilter;
    filter.responsaveis = CheckAllUsuario(usuario, this.responsaveis, this.formFilter, 'responsaveis');
    this.formFilter.patchValue(filter);
  }
  
  pesquisar(){
    this.relatorioService.filtrar(this.formFilter.getRawValue()).subscribe({
      next: resp => { 
        this.result = resp;        
        this.resultsLength = this.result.list?.length
        this.dataSource = new MatTableDataSource<any>(this.result.list);
        this.dataSource.paginator = this.paginator;
      }
    });
  }
    
  buscarFiliais = () => this.filialService.getAllUsuario().subscribe(f => {this.filiais.push({ id: 0, nome: 'TODAS'}); this.filiais = this.filiais.concat(f)});

  buscarResponsaveis = () => this.relatorioService.buscarResponsaveisOperacional().subscribe(r => {this.responsaveis.push(new Usuario(0, 'TODOS'));this.responsaveis = this.responsaveis.concat(r)});
  
  compareFilial = (f1: Filial, f2: Filial): boolean  => compareFilial(f1, f2);

  compareUsuario = (f1: Usuario, f2: Usuario): boolean => compareUsuario(f1, f2);

  voltar = () => this.location.back();

}