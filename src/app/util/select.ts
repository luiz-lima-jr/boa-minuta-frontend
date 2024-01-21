import { FormGroup } from "@angular/forms";
import { CargaFilter } from "../models/carga-filter.model";
import { Filial } from "../models/filial.model";

export function CheckAllFiliais(filial: Filial, filiais: Filial[], formFilter: FormGroup){
    const filter = formFilter.getRawValue() as CargaFilter;
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