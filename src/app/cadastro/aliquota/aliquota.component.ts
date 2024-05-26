import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Aliquota } from 'src/app/models/aliquota.model';
import { TipoAliquota } from 'src/app/models/tipo-aliquota.model';
import { Estado } from 'src/app/models/estado.model';
import { Filial } from 'src/app/models/filial.model';
import { EstadoService } from 'src/app/services/estado.service';
import { AliquotaService } from 'src/app/services/aliquota.service';
import { TipoAliquotaService } from 'src/app/services/tipo-aliquota.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import { FilialService } from 'src/app/services/filial.service';
import { AlertService } from 'src/app/services/alert.service';
import { compareEstado, compareFilial, compareTipoAliquota } from 'src/app/util/compares';


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
      this.aliquotaService.salvar(aliquota).subscribe({
        next: () => {
          this.alertService.success("Aliquota salva");
          this.buscarAliquotas();
          this.resetForm(ngForm)
        }, 
        error: error => {
          this.alertService.error(error.error.detail) 
        }
    });
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
