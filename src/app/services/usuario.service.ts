import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario-cadastro.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URI_AUTH = 'usuario'
  

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.URI_AUTH);
  }

  public salvar(usuario: Usuario): Observable<any> {
    return this.httpClient.post(this.URI_AUTH, usuario);
  }

  public excluir(idUsuario: number): Observable<any> {
    return this.httpClient.delete(`${this.URI_AUTH}/${idUsuario}`);
  }
}
