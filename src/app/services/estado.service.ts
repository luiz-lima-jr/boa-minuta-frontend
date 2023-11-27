import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Estado } from '../models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private URI_AUTH = 'estado'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll = (): Observable<Estado[]>  =>  this.httpClient.get<Estado[]>(this.URI_AUTH);
  
}
