import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRelatorioService } from './base-relatorio-service.service';

@Injectable({
  providedIn: 'root'
})
export class DreService extends BaseRelatorioService {

  constructor(httpClient: HttpClient) {
    super('dre', httpClient)
  }

  public getAnos(): Observable<number[]> {
      return this.httpClient.get<number[]>(this.URI_AUTH+"/anos");
  }

}