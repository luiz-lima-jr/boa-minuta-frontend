import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';
import { Router } from '@angular/router';
import { Carga } from '../models/carga.model';
import { CargaService } from '../services/carga.service';
import { compareFilial } from '../util/compares';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss']
})
export class CargaComponent implements OnInit {

  formFilter: FormGroup;
  displayedColumns: string[] = ['numeroCarga', 'placa', 'valorCarga','resultado', 'responsavel', 
    'faturado', 'municipioDestino', 'cliente', 'volumes', 'dataLimiteCarregamento', 'dataLiberacaoFaturamento', 
    'dataImpressaoMinuta', 'paletizado', 'observacoes'];
  cargas: Carga[] = [];
  filiais: Filial[] = [];


  constructor(private formBuilder: FormBuilder, private filialService: FilialService,
            private router: Router, private cargaService: CargaService) {
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
      filiais: [undefined]
    });
    this.formFilter.valueChanges.subscribe(res => this.filtrarCargas(res));
    this.initFiltroCookie();
  }

  buscarFiliais(){
    this.filialService.getAllUsuario().subscribe(f => this.filiais = f);
  }


  initFiltroCookie(){
    const filtroCookieText = localStorage.getItem('filtroCarga');
    //const filtroCookieText = this.cookieService.get('filtroCarga');
    if(filtroCookieText){
      const filtroCookie = JSON.parse(filtroCookieText);
      this.formFilter.patchValue(filtroCookie);
    } else {      
      this.filtrarCargas({});
    }
  }

  filtrarCargas(filtro: any) {
    localStorage.setItem('filtroCarga', JSON.stringify(this.formFilter.getRawValue()));
    this.cargaService.getCargasDisponiveis(filtro).subscribe({
      next: resp =>{
        this.cargas = resp;
      }, 
      error: error => {        
      } 
    })
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

  voltar(){
    this.router.navigateByUrl('/inicio');
  }
}
