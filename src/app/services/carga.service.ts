import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Estado } from '../models/estado.model';
import { Carga } from '../models/carga.model';
import { CargaFilter } from '../models/carga-filter.model';
import { Frete } from '../models/frete.model';
import { MinutaCarga } from '../models/minuta-carga.model';

@Injectable({
  providedIn: 'root'
})
export class CargaService {

  private URI_AUTH = 'carga'
  

  constructor(private httpClient: HttpClient) {
  }

  public getCargasDisponiveis = (filtro: CargaFilter): Observable<Carga[]> =>  this.httpClient.post<Carga[]>(this.URI_AUTH+"/cargas-disponiveis", filtro);

  public getReceberDetalheCarga(nroCarga: number, idFilial: number): Observable<Carga> {
    var httParams = new HttpParams().set('nroCarga', nroCarga).set('idFilial', idFilial);

    return this.httpClient.get<Carga>(this.URI_AUTH+"/detalhe-carga", {params: httParams});
  }

  public salvar = (frete: Frete) => this.httpClient.post(this.URI_AUTH, frete);

}
