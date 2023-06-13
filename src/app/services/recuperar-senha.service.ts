import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class RecuperarSenhaService {

    private URI_AUTH = 'recuperar-senha'
  

    constructor(private httpClient: HttpClient) {
    }

    public recuperar(idUsuario: number) : Observable<any>{
        let url = this.URI_AUTH + `/${idUsuario}`;
        return this.httpClient.put(url, {});
    }

    public recuperarPorEmail(email: string) : Observable<any>{
        let url = this.URI_AUTH;
        return this.httpClient.put(url, email);
    }

  }  