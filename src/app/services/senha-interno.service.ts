import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlterarSenha } from '../models/alterar-senha.model';

@Injectable({
    providedIn: 'root'
  })
  export class SenhaInternoService {

    private URI_AUTH = 'senha'
  

    constructor(private httpClient: HttpClient) {
    }

    public recuperar(idUsuario: number) : Observable<any>{
        let url = this.URI_AUTH + `/${idUsuario}`;
        return this.httpClient.put(url, {});
    }

    public alterarSenha(alterar: AlterarSenha) : Observable<any>{
      let url = this.URI_AUTH + '/alterar-senha';
      return this.httpClient.put(url, alterar);
    }

  }  