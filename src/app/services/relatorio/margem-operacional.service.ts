import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRelatorioService } from './base-relatorio-service.service';

@Injectable({
  providedIn: 'root'
})
export class MargemOperacionalService extends BaseRelatorioService {

  constructor(httpClient: HttpClient) {
    super('margem-operacional', httpClient)
  }

}
