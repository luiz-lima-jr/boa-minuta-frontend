import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { SenhaExternoService } from 'src/app/services/senha-externo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {

  public email = '';

  constructor( private senhaService: SenhaExternoService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.email){
      this.senhaService.recuperarSenhaExterno(this.email)
          .subscribe({
            next: () => {
              this.alertService.success("Email de alteração enviado!")
              this.router.navigateByUrl('/inicio');
            },
            error: error => {
              this.alertService.warning(error.error.detail)
            }
          });
    }
  }

}
