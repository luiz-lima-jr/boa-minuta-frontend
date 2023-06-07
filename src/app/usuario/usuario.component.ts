import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filial } from '../models/filial.model';
import { FilialService } from '../services/filial.service';
import { ConfirmService } from '../services/confirm.service';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { Usuario } from '../models/usuario-cadastro.model';
import { UsuarioService } from '../services/usuario.service';
import { FuncaoService } from '../services/funcao.service';
import { Funcao } from '../models/funcao.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  formUsuario: FormGroup;
  displayedColumns: string[] = ['usuario', 'filiais', 'funcoes', 'acao'];
  usuarios: Usuario[] = [];
  filiais: Filial[] = [];
  funcoes: Funcao[] = [];

  constructor(private formBuilder: FormBuilder,  private usuarioService: UsuarioService,
            private confirmService: ConfirmService,  private alertService: AlertService,
            private filialService: FilialService, private funcaoService: FuncaoService,
            private snackBar: MatSnackBar){

  }

  ngOnInit(): void {
    this.iniciarUsuarios();
    this.buscarFiliais();
    this.buscarFuncoes();
  }

  buscarFiliais(){
    this.filialService.getAll().subscribe(f => this.filiais = f);
  }

  buscarFuncoes(){
    this.funcaoService.getAll().subscribe(f => this.funcoes = f);
  }

  buscarUsuarios(){
    this.usuarioService.getAll().subscribe(f => this.usuarios = f);
  }

  iniciarUsuarios(){
    this.initFormUsuarios();
    this.buscarUsuarios();
  }

  initFormUsuarios() {
    
    this.formUsuario = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      filiais: ['', Validators.required],
      funcoes: ['', Validators.required],
      senha: ['', Validators.required],
      situacao: ['', Validators.required]
    })
  }

  voltar(){
    this.alertService.error('Salvo com sucesso')
  }

  resetForm(ngForm: any){
    ngForm.resetForm();
    this.buscarFiliais();
  }

  editar(filial: Filial){
    this.formUsuario.patchValue(filial);
  }

  salvar(ngForm: any){
    if(this.formUsuario.valid) {
      let filial = this.formUsuario.getRawValue(); 
      this.usuarioService.salvar(filial).subscribe(
        () => this.resetForm(ngForm)
      );
    }
  }

  excluir(filial: Filial){
    this.confirmService.confirmar("Excluir a filial " + filial.nome + "?", 
    new Observable(() => { 
      this.usuarioService.excluir(filial.id).subscribe({
        next: () => this.buscarFiliais(),
        error: error => this.alertService.error(error.error.detail)
      });
     })
    );
  }
}
