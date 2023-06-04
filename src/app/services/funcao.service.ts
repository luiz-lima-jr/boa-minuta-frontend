import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Funcao } from '../models/funcao.model';

@Injectable({
  providedIn: 'root'
})
export class FuncaoService {

  private URI_AUTH = 'funcao'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Funcao[]> {
    return this.httpClient.get<Funcao[]>(this.URI_AUTH);
  }
}
