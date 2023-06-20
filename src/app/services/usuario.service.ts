import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario-cadastro.model';
import { AlterarSenha } from '../models/alterar-senha.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URI_AUTH = 'usuario'
  

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.URI_AUTH);
  }

  salvar(usuario: Usuario): Observable<any> {
    return this.httpClient.post(this.URI_AUTH, usuario);
  }

  alterar(usuario: Usuario): Observable<any> {
    return this.httpClient.put(this.URI_AUTH, usuario);
  }

  excluir(idUsuario: number): Observable<any> {
    return this.httpClient.delete(`${this.URI_AUTH}/${idUsuario}`);
  }

  getDadosSessao(){
    return this.httpClient.get(`${this.URI_AUTH}/dados-pessoais`);
  }

  alterarDadosPessoais(dados: Usuario){
    return this.httpClient.put(`${this.URI_AUTH}/alterar-dados-pessoais`, dados);
  }

  enviarLinkSenha(idUsuario: number) : Observable<any> {
    let url = this.URI_AUTH + `/enviar-link-senha/${idUsuario}`;
    return this.httpClient.put(url, {});
  }

  alterarSenha(alterar: AlterarSenha) : Observable<any> {
    let url = this.URI_AUTH + '/alterar-senha';
    return this.httpClient.put(url, alterar);
  }
}
