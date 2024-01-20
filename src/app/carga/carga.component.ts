import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';
import { Router } from '@angular/router';
import { Carga } from '../models/carga.model';
import { FreteService } from '../services/frete.service';
import { compareFilial } from '../util/compares';
import { CargaFilter } from '../models/carga-filter.model';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']
})
export class CargaComponent implements OnInit {

  formFilter: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'filial', 'placa', 'valorCarga','resultado', 'responsavel', 
    'faturado', 'municipioDestino', 'cliente', 'volumes', 'dataLimiteCarregamento', 'dataLiberacaoFaturamento', 
    'dataImpressaoMinuta', 'paletizado', 'observacoes'];
  cargas: Carga[] = [];
  filiais: Filial[] = [];


  constructor(private formBuilder: FormBuilder, private filialService: FilialService,
            private router: Router, private cargaService: FreteService) {
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
      todasFiliais: [false]
    });
    this.formFilter.valueChanges.subscribe(res => this.filtrarCargas(res));
    this.initFiltroCookie();
  }

  buscarFiliais(){
    this.filiais.push({ id: 0, nome: 'TODAS'});
    this.filialService.getAllUsuario().subscribe(f => this.filiais = this.filiais.concat(f));
  }


  initFiltroCookie(){
    const filtroCookieText = localStorage.getItem('filtroCarga');
    if(filtroCookieText){
      const filtroCookie = JSON.parse(filtroCookieText);
      this.formFilter.patchValue(filtroCookie);
    } else {      
      this.filtrarCargas(new CargaFilter());
    }
  }

  checkAllFiliais(filial: Filial){
    const filter = this.formFilter.getRawValue() as CargaFilter;
    const todas = filter.todasFiliais;
    let list = new Array();
    if(filial.id === 0){
      if(todas) list = [];
      else this.filiais.forEach(f => list.push(f));
      filter.todasFiliais =! todas;
    } else if(filter.filiais.length === this.filiais.length - 1 && filter.filiais.find(f => f.id === 0) === undefined){
      filter.todasFiliais = true;
      this.filiais.forEach(f => list.push(f));      
    } else {
      filter.todasFiliais = false;
      list = filter.filiais.filter(f => f.id !== 0);
    }
    filter.filiais = list;
    this.setLocalStorageFilter(filter);
    this.formFilter.patchValue(filter);
  }

  filtrarCargas(filtro: CargaFilter) {
    if(!this.filtroFilialIgualStorage(filtro)){
      return;
    }
    if(filtro.filiais.length === 0){
      this.cargas = [];
      return;
    }
    this.setLocalStorageFilter(filtro);
    this.cargaService.getCargasDisponiveis(filtro).subscribe({
      next: resp =>{
        this.cargas = resp;
      }, 
      error: error => {
      } 
    })
  }

  private filtroFilialIgualStorage(filtro: CargaFilter){
    const filtroCookie = this.getFiltroStorage();
    return filtroCookie === null ? false : filtroCookie.filiais.length === filtro.filiais.length;
  }

  getFiltroStorage(){
    const filtroStorageText = localStorage.getItem('filtroCarga');
    return filtroStorageText === null ? null : JSON.parse(filtroStorageText) as CargaFilter;
  }

  private setLocalStorageFilter(value: CargaFilter){
    localStorage.setItem('filtroCarga', JSON.stringify(value));
  }

  compareFilial(f1: Filial, f2: Filial): boolean {
    return compareFilial(f1, f2);
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    ngForm.markAsUntouched();
  }

  getLink(carga: Carga){
    return `frete/${carga.numeroCarga}/${carga.filial.id}`
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

  voltar(){
    this.router.navigateByUrl('/inicio');
  }

  getFilialEmpty(){
    return new Filial();
  }
}
