import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Estado } from '../models/estado.model';
import { Carga } from '../models/carga.model';
import { CargaFilter } from '../models/carga-filter.model';
import { Frete } from '../models/frete.model';
import { MinutaCarga } from '../models/relatorio/minuta-carga.model';

@Injectable({
  providedIn: 'root'
})
export class FreteService {

  private URI_AUTH = 'frete'
  

  constructor(private httpClient: HttpClient) {
  }

  public getCargasDisponiveis(filtro: CargaFilter): Observable<Carga[]> {
    return this.httpClient.post<Carga[]>(this.URI_AUTH+"/cargas-disponiveis", filtro);
  }

  public getReceberDetalheCarga(nroCarga: number, idFilial: number): Observable<Frete> {
    var httParams = new HttpParams().set('nroCarga', nroCarga).set('idFilial', idFilial);

    return this.httpClient.get<Frete>(this.URI_AUTH+"/detalhe-carga", {params: httParams});
  }

  public salvar(frete: Frete) {
    return this.httpClient.post(this.URI_AUTH, frete);
  }

}
