import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuncaoType } from './models/funcao.model';
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
  session = new SessionProfile();
  public isAuthenticated = false;
  private _destroySub$ = new Subject<void>();

  constructor(private _authService: AuthService, private _router: Router) {
  }

  menus : Menu[] = [
    {
      label: 'Cadastro',
      funcoes: ['ADMINISTRADOR'],
      itens: [
        {
          label: 'Filiais',
          action: 'filial',
          funcoes: ['ADMINISTRADOR']
        },
        {
          label: 'Usuários',
          action: 'usuario',
          funcoes: ['ADMINISTRADOR']
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
}

export class Menu{
  label: string;
  funcoes: FuncaoType[];
  icon?: string;
  itens?: Menu[];
  action?: string;
}