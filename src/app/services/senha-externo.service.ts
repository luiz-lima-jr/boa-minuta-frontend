import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlterarSenha } from '../models/alterar-senha.model';

@Injectable({
    providedIn: 'root'
  })
  export class SenhaExternoService {

    private URI_AUTH = 'senha/externo'
  

    constructor(private httpClient: HttpClient) {
    }

    public recuperarSenhaExterno(email: string) : Observable<any>{
        let url = this.URI_AUTH + '/recuperar-senha';
        return this.httpClient.put(url, email);
    }

    public alterarSenhaExterno(alterar: AlterarSenha) : Observable<any>{
      let url = this.URI_AUTH + '/alterar-senha';
      return this.httpClient.put(url, alterar);
    }

  }  