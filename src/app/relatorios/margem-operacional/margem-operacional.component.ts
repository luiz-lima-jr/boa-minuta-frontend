import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { CargaFilter } from "src/app/models/carga-filter.model";
import { Filial } from "src/app/models/filial.model";
import { Frete } from "src/app/models/frete.model";
import { Usuario } from "src/app/models/usuario-cadastro.model";
import { AlertService } from "src/app/services/alert.service";
import { FilialService } from "src/app/services/filial.service";
import { MargemOperacionalService } from "src/app/services/relatorio/margem-operacional.service";
import { compareFilial, compareUsuario } from "src/app/util/compares";
import { CheckAllFiliais, CheckAllUsuario } from "src/app/util/select";


@Component({
  selector: 'app-margem-operacional',
  templateUrl: './margem-operacional.component.html',
  styleUrls: ['./margem-operacional.component.scss']
})
export class MargemOperacionalComponent implements OnInit {  

  formFilter: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'responsavel', 'origem','destino', 'frete', 
    'fretePago', 'custos', 'saldo', 'margem', 'markup'];
  filiais: Filial[] = [];
  responsaveis: Usuario[] = [];
  margemOperacional: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Frete>;
  resultsLength = 0


  constructor(private activatedRoute: ActivatedRoute,  private location: Location, 
              private filialService: FilialService, private formBuilder: FormBuilder, 
              private margemService: MargemOperacionalService, private alertService: AlertService) {
  }

  ngOnInit(): void {    
    this.initFilterForm();
    this.buscarFiliais();
    this.pesquisar();
    this.buscarResponsaveis();
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

  pesquisar(){
    this.margemService.filtrar(this.formFilter.getRawValue()).subscribe({
      next: resp => { 
        this.margemOperacional = resp;        
        this.resultsLength = this.margemOperacional.fretes.length
        this.dataSource = new MatTableDataSource<Frete>(this.margemOperacional.fretes);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  buscarFiliais = () => this.filialService.getAllUsuario().subscribe(f => {this.filiais.push({ id: 0, nome: 'TODAS'}); this.filiais = this.filiais.concat(f)});

  buscarResponsaveis = () => this.margemService.buscarResponsaveisOperacional().subscribe(r => {this.responsaveis.push(new Usuario(0, 'TODOS'));this.responsaveis = this.responsaveis.concat(r)});
 
  compareFilial = (f1: Filial, f2: Filial): boolean  => compareFilial(f1, f2);

  compareUsuario = (f1: Usuario, f2: Usuario): boolean => compareUsuario(f1, f2);

  destacarLabelMargem(frete: Frete){
    const filtro = this.formFilter.controls['margemDesejada'].value;
    return filtro && filtro >= frete.margem;
  }

  voltar = () => this.location.back();

  checkAllFiliais(filial: Filial){
    const filter = this.formFilter.getRawValue() as CargaFilter;
    filter.filiais = CheckAllFiliais(filial, this.filiais, this.formFilter);
    this.formFilter.patchValue(filter);
  }

  checkAllUsuario(usuario: Usuario){
    const filter = this.formFilter.getRawValue() as CargaFilter;
    filter.responsaveis = CheckAllUsuario(usuario, this.responsaveis, this.formFilter, 'responsaveis');
    this.formFilter.patchValue(filter);
  }




}
