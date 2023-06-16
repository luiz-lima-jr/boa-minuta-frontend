import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';
import { FormControl } from '@angular/forms';
import { ConfirmService } from '../services/confirm.service';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';


@Component({
  selector: 'app-filial',
  templateUrl: './filial.component.html',
  styleUrls: ['./filial.component.scss']
})
export class FilialComponent implements OnInit {

  formFilial: FormGroup;
  displayedColumns: string[] = ['nome', 'acao'];
  filiais: Filial[] = [];


  constructor(private formBuilder: FormBuilder, private filialService: FilialService,
            private confirmService: ConfirmService, 
            private alertService: AlertService){

  }

  ngOnInit(): void {
    this.iniciarFiliais();
  }

  buscarFiliais(){
    this.filialService.getAll().subscribe(f => this.filiais = f);
  }

  iniciarFiliais(){
    this.initFormFilliais();
    this.buscarFiliais();
  }

  initFormFilliais() {
    this.formFilial = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      codigoMili: ['', Validators.required]
    })
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    this.buscarFiliais();
  }

  editarFilial(filial: Filial){
    this.formFilial.patchValue(filial);
  }

  salvarFilial(ngForm: any){
    if(this.formFilial.valid) {
      let filial = this.formFilial.getRawValue(); 
      this.filialService.salvar(filial).subscribe(
        () => this.resetForm(ngForm)
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
}
