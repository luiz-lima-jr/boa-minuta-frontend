import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRelatorioService } from './base-relatorio-service.service';

@Injectable({
  providedIn: 'root'
})
export class CaptacaoCaminhoneiroService extends BaseRelatorioService {

  constructor(httpClient: HttpClient) {
    super('captacao-caminhoneiro', httpClient)
  }

}