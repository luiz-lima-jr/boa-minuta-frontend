import { Inject, Injectable } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from 'src/app/auth/auth.service';
const STRING_NO_LOADING = 'noloading';

@Injectable()
export class GiftHttpInterceptor implements HttpInterceptor {
  constructor(@Inject('BASE_API_URL') private baseUrl: string, 
              private cookieService: CookieService,
              private _authService: AuthService,
              private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._authService.validateSession();
    debugger
    if (req.url.indexOf(STRING_NO_LOADING) === -1) {
      this.loadingService.show();
    }
    //let ok: string;
    const dupReq = req.clone({
       url: `${this.baseUrl}/${req.url}`,
       headers: this.setToken(req)
      });
    
    return next.handle(dupReq).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            //ok = 'succeeded';
            //this.verificaExistenciaMensagem(event.body);
          }
        }
        // Operation failed; error is an HttpErrorResponse
        //() => (ok = 'failed')
      ),
      catchError(this.handleError),
      // Log when response observable either completes or errors
      finalize(() => {
        // this.loadingService.hide();
        if (req.url.indexOf(STRING_NO_LOADING) === -1) {
          this.loadingService.hide();
        }
      })
    );
  }

  private setToken(req: HttpRequest<any>) : HttpHeaders{
    return req.headers.set('Authorization', 'Bearer ' + this.cookieService.get('sessionToken'));
  }

  private handleError = (errorResponse: HttpErrorResponse) => {
    if (errorResponse.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', errorResponse.error.message);
    } else {
      console.error(errorResponse);

      if (errorResponse.status === 499) {
        if (!document.location.href.startsWith('http://localhost')) {
          window.location.assign(window.location.href);
        }
        return throwError(errorResponse);
      }
      if ( this._authService.isAuthenticatedValue() && errorResponse.status === 403) {
        this._authService.removeSession()
        window.location.reload();
      }

      if (errorResponse.status === 400) {
        return throwError(errorResponse);
      }

      if (this.verificaExistenciaMensagem(errorResponse.error)) {
        return throwError(errorResponse);
      }
      console.error(`Backend returned code ${errorResponse.status}, ` + `body was: ${errorResponse.error}`);
      //this.alertMessageService.error(errorResponse.status.toString(), errorResponse.message);
      return throwError(errorResponse);
    }
    return throwError('Não foi possível conectar-se ao servidor, verifique sua conexão e tente novamente.');
  };

  //tratamentoGlobalErro = (url: string) => false;
  tratamentoGlobalErro = () => false;

  private verificaExistenciaMensagem(response: any) {
    if (response && response.message) {
      //this.alertMessageService[response.mensagem.tipo](response.mensagem.titulo, response.mensagem.descricao);
      //this.alertMessageService.error(response.error.message, response.error.details);
      return true;
    }
    return false;
  }
}
