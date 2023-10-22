import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MinutaCarga } from "src/app/models/minuta-carga.model";
import { CargaService } from "src/app/services/carga.service";


@Component({
  selector: 'app-pedido-minuta-carga',
  templateUrl: './pedido-minuta-carga.component.html',
  styleUrls: ['./pedido-minuta-carga.component.scss']
})
export class PedidoMinutaCargaComponent implements OnInit {  

  minuta: MinutaCarga;
  idFrete: number;
  displayedColumnsPedidos: string[] = ['descricaoPedido', 'volume', 'qtd','frete', 'valorTotal', 'pesoBruto'];

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
