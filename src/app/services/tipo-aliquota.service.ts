import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TipoAliquota } from '../models/tipo-aliquota.model';

@Injectable({
  providedIn: 'root'
})
export class TipoAliquotaService {

  private URI_AUTH = 'tipo-aliquota'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<TipoAliquota[]> {
    return this.httpClient.get<TipoAliquota[]>(this.URI_AUTH);
  }
}
