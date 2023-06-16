import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertService } from 'src/app/services/alert.service';
import { SenhaInternoService } from 'src/app/services/senha-interno.service';
import { ConfirmService } from 'src/app/services/confirm.service';
import { Usuario } from 'src/app/models/usuario-cadastro.model';
import { ConfirmedValidator } from 'src/app/util/validators';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  formUsuario: FormGroup;
  formSenha: FormGroup;
  constructor(private formBuilder: FormBuilder,  private usuarioService: UsuarioService,
    private senhaService: SenhaInternoService,
            private alertService: AlertService, private router: Router){

  }

  ngOnInit(): void {
    this.initFormUsuarios();
    this.initFormSenha();
  }

  initFormUsuarios() {    
    this.formUsuario = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required]
    })
  }

  initFormSenha() {    
    this.formSenha = this.formBuilder.group({
      senhaAtual: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      confirmarSenha: ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('senha', 'confirmarSenha')
    })
  }

  voltar(){
    this.router.navigateByUrl('/inicio');
  }

  salvar(){
    if(this.formUsuario.valid) {
      let usuario = this.formUsuario.getRawValue(); 
      this.alterarUsuario(usuario);
    }
  }

  alterarUsuario(usuario: Usuario){
    this.usuarioService.salvar(usuario).subscribe({
      next: () => {
        this.alertService.success("Dados alterados com sucesso");
      },
      error: error => this.alertService.error(error.error.detail)
    });
  }
  
  alterarSenha(){
    if(this.formSenha.valid){
      const form = this.formSenha.getRawValue();
      this.senhaService.alterarSenha(form).subscribe({
        next: () => {
          this.alertService.success("Dados alterados com sucesso");
        },
        error: error => this.alertService.error(error.error.detail)
      });
    }    
  }
}
