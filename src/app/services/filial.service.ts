import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Filial } from '../models/filial.model';

@Injectable({
  providedIn: 'root'
})
export class FilialService {

  private URI_AUTH = 'filial'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll = (): Observable<Filial[]> => this.httpClient.get<Filial[]>(this.URI_AUTH);
  

  public getById = (idFilial: number): Observable<Filial> => this.httpClient.get<Filial>(this.URI_AUTH+'/'+idFilial);

  public getAllUsuario = (): Observable<Filial[]> => this.httpClient.get<Filial[]>(this.URI_AUTH+'/usuario');

  public salvar = (filial: Filial): Observable<any> =>  this.httpClient.post(this.URI_AUTH, filial);

  public excluir = (idFilial: number): Observable<any> => this.httpClient.delete(`${this.URI_AUTH}/${idFilial}`);

}
