import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { SenhaExternoService } from 'src/app/services/senha-externo.service';
import { ConfirmedValidator } from 'src/app/util/validators';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.css']
})
export class NovaSenhaComponent implements OnInit {

  public senha = '';
  public confirmar = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private senhaService: SenhaExternoService, 
    private activatedRoute: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('password', 'confirmPassword')
    })
  }

  onSubmit(){
    debugger
    if(this.form.valid){
      let token = '';
      this.activatedRoute.params.subscribe((params) => token = params['token'])
      this.senhaService.alterarSenhaExterno({senha: this.form.controls['password'].value, token: token})
          .subscribe({
            next: () => {
              debugger
              this.alertService.success("Senha alterada com sucesso!")
            },
            error: error => {
              debugger
              this.alertService.error(error.error)
            }
          });
    }
  }

}
