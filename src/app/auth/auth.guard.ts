import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { first, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertService } from '../services/alert.service';
import { possuiFuncaoAcesso } from '../util/funcao-helper';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authSession: AuthService, private _router: Router, private alertService: AlertService) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    return this.authSession.isAuthenticated
      .pipe(
        map((isAuthenticated: boolean) => {          
          const funcoes = route.data['funcoes'];
          const profile = this.authSession.getSessionProfile();
          if(!isAuthenticated){
            return this._router.parseUrl('/login');
          }
          if(!funcoes){
            return true;
          }
          if(profile?.funcoes) {
            const temAcesso = possuiFuncaoAcesso(funcoes, profile?.funcoes);
            if(!temAcesso){
              this.alertService.error("Você não possui acesso a esta página")
              return this._router.parseUrl('/inicio');
            }
          } else {
            return false;
          }
          
          return true;
        }),
        first()
      );
  }
}