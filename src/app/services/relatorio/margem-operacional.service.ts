import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MinutaCarga } from 'src/app/models/minuta-carga.model';
import { Usuario } from 'src/app/models/usuario-cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class MargemOperacionalService {

  private URI_AUTH = 'margem-operacional'
  

  constructor(private httpClient: HttpClient) {
  }

  public filtrar(filtro: any): Observable<any> {

    return this.httpClient.post<any>(this.URI_AUTH, filtro);
  }
  public buscarResponsaveisOperacional(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.URI_AUTH+"/responsaveis-faturamento");
  }

}
