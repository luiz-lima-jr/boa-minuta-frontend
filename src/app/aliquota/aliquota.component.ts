import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aliquota } from '../models/aliquota.model';
import { AliquotaService } from '../services/aliquota.service';
import { ConfirmService } from '../services/confirm.service';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { EstadoService } from '../services/estado.service';
import { TipoAliquotaService } from '../services/tipo-aliquota.service';
import { Estado } from '../models/estado.model';
import { TipoAliquota } from '../models/tipo-aliquota.model';
import { compareEstado, compareFilial, compareTipoAliquota } from '../util/compares';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';


@Component({
  selector: 'app-aliquota',
  templateUrl: './aliquota.component.html',
  styleUrls: ['./aliquota.component.scss']
})
export class AliquotaComponent implements OnInit {

  formAliquota: FormGroup;
  displayedColumns: string[] = ['tipoAliquota', 'origemDestino','filial', 'aliquota', 'acao'];
  aliquotas: Aliquota[] = [];
  estados: Estado[] = [];
  tipoAliquotas: TipoAliquota[] = [];
  filiais: Filial[] = [];


  constructor(private formBuilder: FormBuilder, private aliquotaService: AliquotaService,
            private estadoService: EstadoService, private tipoAliquotaService: TipoAliquotaService,
            private confirmService: ConfirmService, private router: Router,
            private filialService: FilialService, private alertService: AlertService){

  }

  ngOnInit(): void {
    this.iniciarAliquotas();
    this.buscarEstados();
    this.buscarTipoAliquotas();
    this.buscarFiliais();
  }

  buscarAliquotas(){
    this.aliquotaService.getAll().subscribe(f => this.aliquotas = f);
  }
  buscarEstados(){
    this.estadoService.getAll().subscribe(f => this.estados = f);
  }
  buscarTipoAliquotas(){
    this.tipoAliquotaService.getAll().subscribe(f => this.tipoAliquotas = f);
  }
  
  buscarFiliais(){
    this.filialService.getAll().subscribe(f => this.filiais = f);
  }

  iniciarAliquotas(){
    this.initFormFilliais();
    this.buscarAliquotas();
  }

  initFormFilliais() {
    this.formAliquota = this.formBuilder.group({
      id: [''],
      tipoAliquota: ['', Validators.required],
      estadoOrigem: ['', Validators.required],
      estadoDestino: ['', Validators.required],
      filial: ['', Validators.required],
      aliquota: ['', Validators.required]
    })
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    ngForm.markAsUntouched();
  }

  compareTipoAliquota(f1: TipoAliquota, f2: TipoAliquota): boolean {
    return compareTipoAliquota(f1, f2);
  }
  compareEstado(f1: Estado, f2: Estado): boolean {
    return compareEstado(f1, f2);
  }
  compareFilial(f1: Filial, f2: Filial): boolean {
    return compareFilial(f1, f2);
  }

  editarAliquota(aliquota: Aliquota){
    this.formAliquota.patchValue(aliquota);
  }

  salvarAliquota(ngForm: any){
    if(this.formAliquota.valid) {
      let aliquota = this.formAliquota.getRawValue(); 
      this.aliquotaService.salvar(aliquota).subscribe(
        () => {
          this.buscarAliquotas();
          this.resetForm(ngForm)
        } 
      );
    }
  }

  excluir(aliquota: Aliquota){
    this.confirmService.confirmar("Excluir a aliquota ?", 
    new Observable(() => { 
      this.aliquotaService.excluir(aliquota.id).subscribe({
        next: () => this.buscarAliquotas(),
        error: error => this.alertService.error(error.error.detail)
      });
     })
    );
  }
  miliAlterado($event: any){
    if($event > 999999){
      this.formAliquota.controls['codigoMili'].setValue($event.toString().substring(0, 6))
    }
  }

  voltar(){
    this.router.navigateByUrl('/inicio');
  }
}
