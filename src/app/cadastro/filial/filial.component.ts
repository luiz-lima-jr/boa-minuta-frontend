import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { Estado } from 'src/app/models/estado.model';
import { Municipio } from 'src/app/models/municipio.model';
import { EstadoService } from 'src/app/services/estado.service';
import { MunicipioService } from 'src/app/services/municipio.service';
import { compareEstado, compareMunicipio } from 'src/app/util/compares';
import { Filial } from '../../models/filial.model';
import { AlertService } from '../../services/alert.service';
import { ConfirmService } from '../../services/confirm.service';
import { FilialService } from '../../services/filial.service';


@Component({
  selector: 'app-filial',
  templateUrl: './filial.component.html',
  styleUrls: ['./filial.component.scss']
})
export class FilialComponent implements OnInit {

  formFilial: FormGroup;
  displayedColumns: string[] = ['nome', 'acao'];
  filiais: Filial[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  municipioObserver: Observable<Municipio[] | undefined>;


  constructor(private formBuilder: FormBuilder, private filialService: FilialService,
            private confirmService: ConfirmService,  private estadoService: EstadoService, 
            private municipioService: MunicipioService, private router: Router, 
            private alertService: AlertService){

  }

  ngOnInit(): void {
    this.iniciarFiliais();
    this.buscarEstados();
  }

  buscarFiliais(){
    this.filialService.getAll().subscribe(f => this.filiais = f);
  }
  buscarEstados(){
    this.estadoService.getAll().subscribe(f => this.estados = f);
  }

  iniciarFiliais(){
    this.initFormFilliais();
    this.buscarFiliais();
    this.initUsuarioObserver();
  }

  initFormFilliais() {
    this.formFilial = this.formBuilder.group({
      id: [undefined],
      nome: ['', Validators.required],
      codigoMili: ['', Validators.required],
      codigoCarregamento: [''],
      estado: [undefined],
      municipio: [{value: undefined, disabled: true}]
    });

    this.formFilial.get('estado')?.valueChanges.subscribe(e => {
      this.municipioService.getPorEstado(e.id).subscribe(m => {
        this.municipios = m;
        this.formFilial.get('municipio')?.enable();
      });
    })
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    ngForm.markAsUntouched();
  }

  editarFilial(filial: Filial){
    this.formFilial.patchValue(filial);
    this.formFilial.get('estado')?.setValue(filial.municipio?.estado)
  }

  salvarFilial(ngForm: any){
    if(this.formFilial.valid) {
      let filial = this.formFilial.getRawValue(); 
      
      if(filial.municipio && typeof(filial.municipio) === 'string') {
        filial.municipio = undefined;
      }

      if(filial.codigoCarregamento && !filial.municipio){
        this.alertService.error('Obrigatório informar a UF e município');
        return;
      }
      this.filialService.salvar(filial).subscribe(
        () => {
          this.buscarFiliais();
          this.resetForm(ngForm)
        } 
      );
    }
  }

  excluir(filial: Filial){
    this.confirmService.confirmar("Excluir a filial " + filial.nome + "?", 
    new Observable(() => { 
      this.filialService.excluir(filial.id).subscribe({
        next: () => this.buscarFiliais(),
        error: error => this.alertService.error(error.error.detail)
      });
     })
    );
  }
  miliAlterado($event: any){
    if($event > 999999){
      this.formFilial.controls['codigoMili'].setValue($event.toString().substring(0, 6))
    }
  }
  compareEstado(f1: Estado, f2: Estado): boolean {
    return compareEstado(f1, f2);
  }

  compareMunicipio(f1: Municipio, f2: Municipio): boolean {
    return compareMunicipio(f1, f2);
  }

  displayMunicipio(municipio: Municipio): string {
    return municipio ? `${municipio.nome}` : '';
  }
  
  initUsuarioObserver(){    
    this.municipioObserver = this.formFilial.controls['municipio'].valueChanges.pipe(
      startWith(''),
      map(value => {
        if(value?.nome){
          return this.municipios.filter(m => m.nome.toLowerCase().startsWith(value?.nome.toLowerCase()));
        } else if(value) {          
          return this.municipios.filter(m => m.nome.toLowerCase().startsWith(value.toLowerCase()));
        }
        return []
      }),
    );
  }

  voltar(){
    this.router.navigateByUrl('/inicio');
  }
}
