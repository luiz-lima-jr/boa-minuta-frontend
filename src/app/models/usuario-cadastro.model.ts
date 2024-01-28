import { Filial } from "./filial.model";
import { Funcao } from "./funcao.model";

export class Usuario {
    id: number;
    email: string;
    nome: string;
    senha: string;
    funcoes: Funcao[];
    filiais: Filial[];

    constructor( id: number, nome: string){
        this.id = id;
        this.nome = nome;
    }
}