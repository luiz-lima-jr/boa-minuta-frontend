import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Aliquota } from '../models/aliquota.model';

@Injectable({
  providedIn: 'root'
})
export class AliquotaService {

  private URI_AUTH = 'aliquota'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Aliquota[]> {
    return this.httpClient.get<Aliquota[]>(this.URI_AUTH);
  }
  
  public getAliquota(idEstadoOrigem: number, idEstadoDestino: number, idTipoAliquota: number): Observable<Aliquota> {

    const params = new HttpParams().set('idEstadoOrigem', idEstadoOrigem)
                                   .set('idEstadoDestino', idEstadoDestino)
                                   .set('idTipoAliquota', idTipoAliquota);
 
    return this.httpClient.get<Aliquota>(this.URI_AUTH+'/buscar-aliquota', {params: params});
  }

  public salvar(aliquota: Aliquota): Observable<any> {
    return this.httpClient.post(this.URI_AUTH, aliquota);
  }

  public excluir(idAliquota: number): Observable<any> {
    return this.httpClient.delete(`${this.URI_AUTH}/${idAliquota}`);
  }
}
