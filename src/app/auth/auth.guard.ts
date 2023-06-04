import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authSession: AuthService, private _router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.authSession.isAuthenticated
      .pipe(
        map((s: boolean) => s ? true: this._router.parseUrl('/login'))
      );
  }
}
