import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public username = '';
  public password = '';

  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private alertService: AlertService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/inicio';
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated.pipe(
      filter((isAuthenticated: boolean) => isAuthenticated),
      takeUntil(this._destroySub$)
    ).subscribe( _ => this._router.navigateByUrl(this.returnUrl));
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public onSubmit(): void {
    if(this.username && this.password) {
      this._authService.login(this.username, this.password).subscribe({
        next: resp => {
          this._router.navigateByUrl('/inicio');
          window.location.reload();
        },
        error: err => {
          this.alertService.warning("Usuário ou senha inválidos")
        }
      })
    }
  }
}
