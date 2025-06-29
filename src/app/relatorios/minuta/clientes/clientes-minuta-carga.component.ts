import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MinutaCarga } from "src/app/models/relatorio/minuta-carga.model";


@Component({
  selector: 'app-clientes-minuta-carga',
  templateUrl: './clientes-minuta-carga.component.html',
  styleUrls: ['./clientes-minuta-carga.component.scss']
})
export class ClientesMinutaCargaComponent implements OnInit {  

  @Input() minuta: MinutaCarga;
  idFrete: number;
  displayedColumnsClientes: string[] = ['nome', 'endereco', 'cidade'];

  constructor(private activatedRoute: ActivatedRoute,  private location: Location) {
  }

  ngOnInit(): void {
  }

  voltar(){
    this.location.back();
  }
}
