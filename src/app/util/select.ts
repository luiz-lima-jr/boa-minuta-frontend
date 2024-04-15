import { FormGroup } from "@angular/forms";
import { FreteFilter } from "../models/carga-filter.model";
import { Filial } from "../models/filial.model";
import { Usuario } from "../models/usuario-cadastro.model";

export function CheckAllFiliais(filial: Filial, filiais: Filial[], formFilter: FormGroup){
    const filter = formFilter.getRawValue() as FreteFilter;
    const filial0 = filter.filiais.find(f => f.id === 0);
    const todasSelecionadas = filter.filiais.length === filiais.length - 1 && filial0 === undefined && filial.id !== 0;
    let list = new Array(); 

    if(filial.id === 0){
      list = filial0 ? list.concat(filiais) : [];
    } else {
      list = todasSelecionadas ? list.concat(filiais) : filter.filiais.filter(f => f.id !== 0);
    }
    
    return list;
}

export function CheckAllUsuario(usuario: Usuario, usuarios: Usuario[], formFilter: FormGroup, paramFilter: string){
    const filter = formFilter.getRawValue();
    const listFilter = filter[paramFilter] as  Usuario[];
    const usuario0 = listFilter.find(f => f.id === 0);
    const todasSelecionadas = listFilter.length === usuarios.length - 1 && usuario0 === undefined && usuario.id !== 0;
    let list = new Array(); 

    if(usuario.id === 0){
      list = usuario0 ? list.concat(usuarios) : [];
    } else {
      list = todasSelecionadas ? list.concat(usuarios) : listFilter.filter(f => f.id !== 0);
    }
    
    return list;
}