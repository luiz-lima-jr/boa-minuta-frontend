import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthToken } from './auth-token.model';
import { SessionProfile } from '../models/session-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private URI_AUTH = 'auth'
  private authSub: BehaviorSubject<boolean>;
  private pathsExterno = ['/recuperar-senha', '/nova-senha']

  constructor(private _router: Router, private httpClient: HttpClient, private cookieService: CookieService) {
    this.authSub = new BehaviorSubject<boolean>(false);
  }

  ngOnDestroy(): void {
    this.removeSession()
  }
  public login(email: string, senha: string): Observable<void> {
    return this.httpClient.post<AuthToken>(this.URI_AUTH, {email, senha})
    .pipe(
      map((t: AuthToken) => this.createSession(t))
    )
  }

  logout(): Observable<void> {
    const uri = this.URI_AUTH + '/logout';
    return this.httpClient.delete(uri)
    .pipe(map(() => this.removeSession() ))
  }


  private createSession(transaction: AuthToken): void {
    this.authSub.next(true);
    this.cookieService.set('sessionToken', transaction.sessionToken);
    localStorage.setItem('sessionProfile', JSON.stringify(transaction.sessionProfile));
  }
  
  private async existsCookieSession() : Promise<boolean>{
    return this.cookieService.check('sessionToken');
}

  get isAuthenticated(): Observable<boolean> {
    this.existsCookieSession().then(exists => this.authSub.next(exists));
    return this.authSub.asObservable();
  }

  isAuthenticatedValue(): boolean {
    let value = false;
    this.isAuthenticated.subscribe(is => value = is);
    return value;
  }

  validateSession() {    
    if(this.pathsExterno.includes(this._router.url)){
      return;
    }
    this.isAuthenticated.subscribe(exists => exists ? true: this._router.navigateByUrl('/login'));
  }

  getProfile() : SessionProfile | undefined {
    const sessionStorage = localStorage.getItem('sessionProfile')
    return sessionStorage && sessionStorage !== "undefined" ? JSON.parse(sessionStorage) : undefined
  }

  removeSession(){
    this.cookieService.delete('sessionToken');
    this.cookieService.delete('sessionProfile');
    this.authSub.next(false);
    this.authSub.complete();
  }

}