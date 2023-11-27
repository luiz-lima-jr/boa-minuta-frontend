import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { OptionsModalConfirmar } from '../components/confirm/confirm-modal/confirm-modal.component';

@Injectable({
    providedIn: 'root'
  })
export class ConfirmService {
    private subject = new Subject<OptionsModalConfirmar>();
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

    confirmar(message: string, acao: Observable<any>) {
        this.keepAfterNavigationChange = false;
        this.subject.next({ mensagem: message, acao: acao });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}