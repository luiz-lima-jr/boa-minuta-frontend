import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';
import { Router } from '@angular/router';
import { FreteService } from '../services/frete.service';
import { compareFilial } from '../util/compares';
import { FreteFilter as FreteFilter } from '../models/carga-filter.model';
import { CheckAllFiliais } from '../util/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Frete } from '../models/frete.model';


@Component({
  selector: 'app-listar-fretes',
  templateUrl: './listar-fretes.component.html',
  styleUrls: ['./listar-fretes.component.scss']
})
export class ListarFretesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Frete>;

  resultsLength = 0
  totalLength = 0;

  formFilter: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'filial', 'placa', 'valorCarga','resultado', 'responsavel', 
    'faturado', 'municipioDestino', 'cliente', 'volumes', 'dataLimiteCarregamento', 'dataLiberacaoFaturamento', 
    'dataImpressaoMinuta', 'paletizado', 'observacoes'];
  filiais: Filial[] = [];


  constructor(private formBuilder: FormBuilder, private filialService: FilialService,
            private router: Router, private freteService: FreteService) {
  }

  ngOnInit(): void {
    this.initFilterForm();
    this.buscarFiliais();
  }

  initFilterForm(){
    this.formFilter = this.formBuilder.group({
      semPlaca: [undefined],
      comPlaca: [undefined],
      faturadas: [undefined],
      dataInicioFaturamento: [undefined],
      dataFimFaturamento: [undefined],
      filiais: [undefined],
      numeroCarga: [undefined],
      todasFiliais: [false],
      pagina: [undefined], 
      qtdPagina: [undefined]
    });
    this.formFilter.valueChanges.subscribe(res => this.filtrarCargas(res));
    this.formFilter.controls[""]
    this.initFiltroCookie();
  }

  buscarFiliais(){
    this.filiais.push({ id: 0, nome: 'TODAS'});
    this.filialService.getAllUsuario().subscribe(f => this.filiais = this.filiais.concat(f));
  }


  initFiltroCookie(){
    const filtroCookieText = localStorage.getItem('filtroFrete');
    if(filtroCookieText){
      const filtroCookie = JSON.parse(filtroCookieText);
      this.formFilter.patchValue(filtroCookie);
    } else {      
      this.filtrarCargas(new FreteFilter());
    }
  }
  
  checkAllFiliais(filial: Filial){
    const filter = this.formFilter.getRawValue() as FreteFilter;
    filter.filiais = CheckAllFiliais(filial, this.filiais, this.formFilter);
    this.setLocalStorageFilter(filter);
    this.formFilter.patchValue(filter);
  }

  filtrarCargas(filtro: FreteFilter) {
    if(!this.filtroFilialIgualStorage(filtro)){
      return;
    }
    if(filtro.filiais.length === 0){
      this.dataSource = new MatTableDataSource<Frete>([]);
      return;
    }
    this.freteService.getCargasDisponiveis(filtro).subscribe({
      next: resp =>{
        this.dataSource = new MatTableDataSource<Frete>(resp.fretes);
      //  this.dataSource.paginator = this.paginator;
        this.totalLength = resp.qtd;
        this.setLocalStorageFilter(filtro);
      }, 
      error: error => {
      } 
    })
  }

  private filtroFilialIgualStorage(filtro: FreteFilter){
    const filtroCookie = this.getFiltroStorage();
    return filtroCookie === null ? false : filtroCookie.filiais.length === filtro.filiais.length;
  }

  getFiltroStorage(){
    const filtroStorageText = localStorage.getItem('filtroFrete');
    return filtroStorageText === null ? null : JSON.parse(filtroStorageText) as FreteFilter;
  }

  private setLocalStorageFilter(value: FreteFilter){
    value.numeroCarga = undefined;
    value.pagina = undefined;
    
    localStorage.setItem('filtroFrete', JSON.stringify(value));
  }

  compareFilial(f1: Filial, f2: Filial): boolean {
    return compareFilial(f1, f2);
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    ngForm.markAsUntouched();
  }

  getLink(frete: Frete){
    return `frete/${frete.numeroCarga}/${frete.filial.id}`
  }

  getNomeCliente(clientes: any[]){
    if(clientes)
      return clientes?.length > 1 ? 'DIVERSOS' : clientes[0].nome;
    else
      return ''
  }

  abreviarNomeFilial(nome: string){
    return nome.length > 10 ? nome.substring(0, 10) : nome;
  }

  paginaAlterada(event: any){
    debugger
    this.formFilter.controls['pagina'].setValue(event.pageIndex);
    this.formFilter.controls['qtdPagina'].setValue(event.pageSize);

    this.filtrarCargas(this.formFilter.getRawValue());
  }

  voltar(){
    this.router.navigateByUrl('/inicio');
  }

  getFilialEmpty(){
    return new Filial();
  }
}
