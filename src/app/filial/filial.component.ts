import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
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
  idControl: FormControl;
  nomeControl: FormControl;
  codigoMiliControl: FormControl;


  @ViewChild(MatTable) table: MatTable<Filial>;

  @ViewChild("formFilialTemplate")
  formFilialTemplate: NgForm;

  //@ViewChild(MatDialog) dialogCadastro: MatDialog;

  @ViewChild('dialogCadastro', { read: TemplateRef }) dialogCadastro:TemplateRef<any>;


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
    this.idControl = new FormControl();
    this.nomeControl = new FormControl('', Validators.required);
    this.codigoMiliControl = new FormControl('', Validators.required);
    this.formFilial = this.formBuilder.group({
      id: this.idControl,
      nome: this.nomeControl,
      codigoMili: this.codigoMiliControl
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
}
