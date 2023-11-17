import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MinutaCarga } from 'src/app/models/minuta-carga.model';

@Injectable({
  providedIn: 'root'
})
export class MinutaService {

  private URI_AUTH = 'minuta'
  

  constructor(private httpClient: HttpClient) {
  }

  public getMinuta(idFrete: number): Observable<MinutaCarga> {

    return this.httpClient.get<MinutaCarga>(this.URI_AUTH+"/"+idFrete);
  }

}
