import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { OptionsModal, TipoAlerta } from '../components/alert/alert-modal/alert-modal.component';

@Injectable({
    providedIn: 'root'
  })
export class AlertService {
    private subject = new Subject<OptionsModal>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    this.keepAfterNavigationChange = false;
                } else {
                    this.subject.next({});
                }
            }
        });
    }

    success(message: string,  timeout: number = 3000) {
        this.keepAfterNavigationChange = false;
        this.subject.next({ tipo: TipoAlerta.SUCESS, mensagem: message, timeout: timeout });
    }

    error(message: string, timeout: number = 3000) {
        this.keepAfterNavigationChange = false;
        this.subject.next({ tipo: TipoAlerta.ERROR, mensagem: message, timeout: timeout });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}