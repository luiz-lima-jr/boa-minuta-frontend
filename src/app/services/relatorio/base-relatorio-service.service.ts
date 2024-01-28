import { HttpClient } from "@angular/common/http";
import { Usuario } from "src/app/models/usuario-cadastro.model";
import { Observable } from 'rxjs';

export abstract class BaseRelatorioService {
    
    protected URI_AUTH: string;

    constructor(protected uri: string,  protected httpClient: HttpClient) {
        this.URI_AUTH = uri;
    }    

    public buscarResponsaveisOperacional(): Observable<Usuario[]> {
        return this.httpClient.get<Usuario[]>(this.URI_AUTH+"/responsaveis-faturamento");
    }
    
    public filtrar(filtro: any): Observable<any> {
        return this.httpClient.post<any>(this.URI_AUTH, filtro);
    }
}