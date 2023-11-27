import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MinutaCarga } from "src/app/models/minuta-carga.model";
import { FreteService } from "src/app/services/frete.service";


@Component({
  selector: 'app-pedido-minuta-carga',
  templateUrl: './pedido-minuta-carga.component.html',
  styleUrls: ['./pedido-minuta-carga.component.scss']
})
export class PedidoMinutaCargaComponent implements OnInit {  

  @Input() minuta: MinutaCarga;
  idFrete: number;
  displayedColumnsPedidos: string[] = ['descricaoPedido', 'volume', 'qtd','frete', 'valorTotal', 'pesoBruto'];

  constructor(private activatedRoute: ActivatedRoute,  private location: Location, private cargaService: FreteService) {
  }

  ngOnInit(): void {
  }

  voltar(){
    this.location.back();
  }
}
