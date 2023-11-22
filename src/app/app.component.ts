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
    {
      label: 'Aliquota',
      action: 'aliquota',
      funcoes: [],
      icon: 'assignment',
    },
    {
      label: 'Carga',
      action: 'carga',
      funcoes: [],
      icon: 'assignment',
    },{
      label: 'Relatórios',
      funcoes: [],
      icon: 'assignment',
      itens: [
        {
          label: 'Minuta',
          action: 'minuta/:idFrete',
          funcoes: [],
          icon: 'assignment',
        },
        {
          label: 'Margem Operacional',
          action: 'margem-operacional',
          funcoes: ['ADMINISTRADOR'],
          icon: 'assignment',
        }
      ]
    }
  ]

  public exibirMenu = (funcoesMenu: string[]) : boolean => {    
    return funcoesMenu.length === 0 || this.session?.funcoes?.filter(r => funcoesMenu.includes(r)).length > 0
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated.pipe(
      takeUntil(this._destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);
    const profile = this._authService.getSessionProfile()
    if(profile){
      this.session = profile;
    }
  }

  public ngOnDestroy(): void {
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
    this.showModalPerfil = false;
  }

  exibirModal(){
    this.showModalPerfil = !this.showModalPerfil;
  }

  closeMenu(sidenav: any){
    if(sidenav._opened) {
      sidenav.toggle();
    }
  }
}

export class Menu{
  label: string;
  funcoes: FuncaoType[];
  icon?: string;
  itens?: Menu[];
  action?: string;
}