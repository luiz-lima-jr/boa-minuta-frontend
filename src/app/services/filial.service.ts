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

  public getAll(): Observable<Filial[]> {
    return this.httpClient.get<Filial[]>(this.URI_AUTH);
  }

  public salvar(filial: Filial): Observable<any> {
    return this.httpClient.post(this.URI_AUTH, filial);
  }

  public excluir(idFilial: number): Observable<any> {
    return this.httpClient.delete(`${this.URI_AUTH}/${idFilial}`);
  }
}
