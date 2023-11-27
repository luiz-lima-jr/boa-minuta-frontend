import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Caminhao } from '../models/caminhao.model';
import { PessoaTransporte } from '../models/pessoa-transporte.model';

@Injectable({
  providedIn: 'root'
})
export class PessoaTransporteService {

  private URI_AUTH = 'pessoa-transporte'
  

  constructor(private httpClient: HttpClient) {
  }

  public getByNome(nome: string): Observable<PessoaTransporte[]> {
    const params = new HttpParams().set('nome', nome);
    return this.httpClient.get<PessoaTransporte[]>(this.URI_AUTH, {params: params});
  }

  public salvar= (pessoaTransporte: PessoaTransporte): Observable<any> => this.httpClient.post(this.URI_AUTH, pessoaTransporte);
}
