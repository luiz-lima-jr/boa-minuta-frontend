import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { SenhaExternoService } from 'src/app/services/senha-externo.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit {

  public email = '';

  constructor( private senhaService: SenhaExternoService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.email){
      this.senhaService.recuperarSenhaExterno(this.email)
          .subscribe({
            next: () => {
              debugger
              this.alertService.success("Email de alteração enviado!")
            },
            error: error => {
              debugger
              this.alertService.warning(error.error.detail)
            }
          });
    }
  }

}
