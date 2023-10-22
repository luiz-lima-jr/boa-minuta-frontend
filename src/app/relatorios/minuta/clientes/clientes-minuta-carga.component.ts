import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MinutaCarga } from "src/app/models/minuta-carga.model";
import { CargaService } from "src/app/services/carga.service";


@Component({
  selector: 'app-clientes-minuta-carga',
  templateUrl: './clientes-minuta-carga.component.html',
  styleUrls: ['./clientes-minuta-carga.component.scss']
})
export class ClientesMinutaCargaComponent implements OnInit {  

  minuta: MinutaCarga;
  idFrete: number;
  displayedColumnsClientes: string[] = ['nome', 'endereco', 'cidade'];

  constructor(private activatedRoute: ActivatedRoute,  private location: Location, private cargaService: CargaService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => { 
      this.idFrete = params['idFrete'];
    })
    this.buscarMinuta();
  }

  buscarMinuta(){
    this.cargaService.getMinuta(this.idFrete).subscribe(resp => this.minuta = resp);
  }

  voltar(){
    this.location.back();
  }
}
