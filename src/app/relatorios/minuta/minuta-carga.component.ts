import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MinutaCarga } from "src/app/models/minuta-carga.model";
import { AlertService } from "src/app/services/alert.service";
import { CargaService } from "src/app/services/carga.service";


@Component({
  selector: 'app-minuta-carga',
  templateUrl: './minuta-carga.component.html',
  styleUrls: ['./minuta-carga.component.scss']
})
export class MinutaCargaComponent implements OnInit {  

  minuta: MinutaCarga;
  idFrete: number;
  displayedColumnsPedidos: string[] = ['descricaoPedido', 'volume', 'qtd','frete', 'valorTotal', 'pesoBruto'];

  constructor(private activatedRoute: ActivatedRoute,  private location: Location, private cargaService: CargaService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => { 
      this.idFrete = params['idFrete'];
    })
    this.buscarMinuta();
  }

  buscarMinuta(){
    this.cargaService.getMinuta(this.idFrete).subscribe({
      next: resp => this.minuta = resp,
      error: error => {
      }
    });
  }

  voltar(){
    this.location.back();
  }
}
