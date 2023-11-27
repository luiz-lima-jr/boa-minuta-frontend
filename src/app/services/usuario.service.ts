import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../models/usuario-cadastro.model';
import { AlterarSenha } from '../models/alterar-senha.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URI_AUTH = 'usuario'
  

  constructor(private httpClient: HttpClient) {
  }

  validarSessao = () => this.httpClient.get<any>(this.URI_AUTH);

  getAll = (): Observable<Usuario[]> => this.httpClient.get<Usuario[]>(this.URI_AUTH);

  salvar = (usuario: Usuario): Observable<any>  => this.httpClient.post(this.URI_AUTH, usuario);

  alterar = (usuario: Usuario): Observable<any> => this.httpClient.put(this.URI_AUTH, usuario);

  excluir = (idUsuario: number): Observable<any> => this.httpClient.delete(`${this.URI_AUTH}/${idUsuario}`);

  getDadosSessao = () => this.httpClient.get(`${this.URI_AUTH}/dados-pessoais`);

  alterarDadosPessoais = (dados: Usuario) =>  this.httpClient.put(`${this.URI_AUTH}/alterar-dados-pessoais`, dados);

  enviarLinkSenha(idUsuario: number) : Observable<any> {
    let url = this.URI_AUTH + `/enviar-link-senha/${idUsuario}`;
    return this.httpClient.put(url, {});
  }

  alterarSenha(alterar: AlterarSenha) : Observable<any> {
    let url = this.URI_AUTH + '/alterar-senha';
    return this.httpClient.put(url, alterar);
  }

  getByNome(nome: string): Observable<Usuario[]> {
    const params = new HttpParams().set('nome', nome);
    return this.httpClient.get<Usuario[]>(this.URI_AUTH+"/buscar-por-nome", {params: params});
  }
}
