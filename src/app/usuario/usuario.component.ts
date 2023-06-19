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
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  formUsuario: FormGroup;
  displayedColumns: string[] = ['usuario', 'filiais', 'funcoes', 'email', 'situacao', 'acao'];
  usuarios: Usuario[] = [];
  filiais: Filial[] = [];
  funcoes: Funcao[] = [];

  constructor(private formBuilder: FormBuilder,  private usuarioService: UsuarioService,
            private confirmService: ConfirmService,  private alertService: AlertService,
            private filialService: FilialService, private funcaoService: FuncaoService,
            private router: Router){

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

  iniciarUsuarios() {
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

  initFormUsuariosEdit() {    
    this.formUsuario = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      filiais: ['', Validators.required],
      funcoes: ['', Validators.required],
      situacao: ['', Validators.required]
    })
  }

  voltar(){
    this.router.navigateByUrl('/inicio');
  }

  resetForm(ngForm: any){
    ngForm.resetForm()
    this.initFormUsuarios();
    ngForm.markAsUntouched();
  }

  editar(usuario: Usuario) {
    this.initFormUsuariosEdit();
    this.formUsuario.patchValue(usuario);
  }

  compareFilial(f1: Filial, f2: Filial): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  compareFuncoes(f1: Funcao, f2: Funcao): boolean {
    return f1 && f2 ? f1.id === f2.id : f1 === f2;
  }

  reenviarSenha(usuario: Usuario){
    this.confirmService.confirmar("Reenviar a senha do usuário " + usuario.nome + "?", 
    new Observable(() => {
      this.usuarioService.enviarLinkSenha(usuario.id).subscribe({
        next: () => {
          this.alertService.success("Email enviado com sucesso");
          this.buscarUsuarios();
        },
        error: error => this.alertService.error(error.error.detail)
      });
     })
    );
  }

  salvar(ngForm: any){
    if(this.formUsuario.valid) {
      let usuario = this.formUsuario.getRawValue(); 
      if(usuario.id){
        this.alterarUsuario(usuario, ngForm);
      } else {
        this.salvarUsuario(usuario, ngForm);
      }
    }
  }

  salvarUsuario(usuario: Usuario, ngForm: any){
    this.usuarioService.salvar(usuario).subscribe({
      next: () => {
        this.alertService.success("Usuário salvo com sucesso");
        this.buscarUsuarios();
        this.resetForm(ngForm);
      },
      error: error => this.alertService.error(error.error.detail)
    });
  }

  alterarUsuario(usuario: Usuario, ngForm: any){
    this.usuarioService.salvar(usuario).subscribe({
      next: () => {
        this.alertService.success("Usuário alterado com sucesso");
        this.resetForm(ngForm);
        this.buscarUsuarios();
      },
      error: error => this.alertService.error(error.error.detail)
    });
  }

  getFiliaisLabel(usuario: Usuario) {
    return usuario.filiais.map(f => ' ' + f.nome);
  }

  getFuncoesLabel(usuario: Usuario) {
    return usuario.funcoes.map(f => ' ' + f.descricao);
  }

  excluir(usuario: Usuario){
    this.confirmService.confirmar("Excluir o usuário " + usuario.nome + "?", 
    new Observable(() => { 
      this.usuarioService.excluir(usuario.id).subscribe({
        next: () => {
          this.alertService.success('Usuário excluído com sucesso')
          this.buscarUsuarios()
        },
        error: error => this.alertService.error(error.error.detail)
      });
     })
    );
  }
}
