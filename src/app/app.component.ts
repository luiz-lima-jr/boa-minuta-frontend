import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ADMINISTRADOR, FuncaoType } from './models/funcao.model';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { SessionProfile } from './models/session-profile.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'Boa Minuta';
  showModalPerfil = false;
  session = new SessionProfile();
  public isAuthenticated = false;
  private _destroySub$ = new Subject<void>();

  constructor(private _authService: AuthService, private _router: Router) {
  }

  menus : Menu[] = [
    {
      label: 'Cadastro',
      funcoes: [ADMINISTRADOR],
      icon: 'assignment',
      itens: [
        {
          label: 'Filiais',
          action: 'filial',
          icon: 'apartment',
          funcoes: [ADMINISTRADOR]
        },
        {
          label: 'Usuários',
          action: 'usuario',
          icon: 'person',
          funcoes: [ADMINISTRADOR]
        }
      ]
    },
  ]

  public exibirMenu = (funcoesMenu: string[]) : boolean => {    
    return this.session?.funcoes?.filter(r => funcoesMenu.includes(r)).length > 0
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated.pipe(
      takeUntil(this._destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
    const profile = this._authService.getProfile()
    if(profile){
      this.session = profile;
    }
  }

  public ngOnDestroy(): void {
    debugger
    this._destroySub$.next();
  }

  public logout(): void {
    this._authService.logout().subscribe(
      () =>{
        this._router.navigateByUrl('/login')
        window.location.reload()
      }
    );
  }

  esconderModal(){    
    console.log('esconderModal')
    this.showModalPerfil = false;
  }

  exibirModal(){
    console.log('exibirModal')
    this.showModalPerfil = !this.showModalPerfil;
  }
}

export class Menu{
  label: string;
  funcoes: FuncaoType[];
  icon?: string;
  itens?: Menu[];
  action?: string;
}