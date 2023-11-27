import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertService } from 'src/app/services/alert.service';
import { Usuario } from 'src/app/models/usuario-cadastro.model';
import { ConfirmedValidator } from 'src/app/util/validators';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  formUsuario: FormGroup;
  formSenha: FormGroup;
  constructor(private formBuilder: FormBuilder,  private usuarioService: UsuarioService,
            private authService: AuthService, private alertService: AlertService, 
            private router: Router){

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
    this.usuarioService.getDadosSessao().subscribe(res => {
      this.formUsuario.patchValue(res);
    });
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

  voltar = () =>  this.router.navigateByUrl('/inicio');

  salvar(){
    if(this.formUsuario.valid) {
      let usuario = this.formUsuario.getRawValue(); 
      this.usuarioService.alterarDadosPessoais(usuario).subscribe({
        next: () => {
          this.alertService.success("Dados alterados com sucesso. Efetue o login novamente!");
          this.authService.logout().subscribe();
        },
        error: error => this.alertService.error(error.error.detail)
      });
    }
  }

  alterarUsuario(usuario: Usuario){
    
  }
  
  alterarSenha(formSenhaT: any){
    if(this.formSenha.valid){
      const form = this.formSenha.getRawValue();
      this.usuarioService.alterarSenha(form).subscribe({
        next: () => {
          this.alertService.success("Dados alterados com sucesso");
          this.initFormSenha();
          this.formSenha.markAsUntouched();
          formSenhaT.resetForm();
        },
        error: error => this.alertService.error(error.error.detail)
      });
    }    
  }
}