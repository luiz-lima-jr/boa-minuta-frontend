import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Caminhao } from '../models/caminhao.model';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {

  private URI_AUTH = 'caminhao'
  

  constructor(private httpClient: HttpClient) {
  }

  public getByPlaca(placa: string): Observable<Caminhao[]> {
    const params = new HttpParams().set('placa', placa);
    return this.httpClient.get<Caminhao[]>(this.URI_AUTH, {params: params});
  }

  public salvar = (caminhao: Caminhao): Observable<any> => this.httpClient.post(this.URI_AUTH, caminhao);
  
}
