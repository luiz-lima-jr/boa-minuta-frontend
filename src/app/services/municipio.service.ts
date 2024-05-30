import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  private URI_AUTH = 'municipio'
  

  constructor(private httpClient: HttpClient) {
  }

  public getPorEstado(idEstado: number): Observable<Municipio[]> {
    return this.httpClient.get<Municipio[]>(this.URI_AUTH+`/${idEstado}`);
  }
}
