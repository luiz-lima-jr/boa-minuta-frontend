import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FreteFilter } from '../models/carga-filter.model';
import { Frete } from '../models/frete.model';

@Injectable({
  providedIn: 'root'
})
export class FreteService {

  private URI_AUTH = 'frete'
  

  constructor(private httpClient: HttpClient) {
  }

  public getCargasDisponiveis(filtro: FreteFilter): Observable<Frete[]> {
    return this.httpClient.post<Frete[]>(this.URI_AUTH+"/cargas-disponiveis", filtro);
  }

  public getReceberDetalheCarga(nroCarga: number, idFilial: number): Observable<Frete> {
    var httParams = new HttpParams().set('nroCarga', nroCarga).set('idFilial', idFilial);

    return this.httpClient.get<Frete>(this.URI_AUTH+"/detalhe-carga", {params: httParams});
  }

  public salvar(frete: Frete) {
    return this.httpClient.post(this.URI_AUTH, frete);
  }

}
