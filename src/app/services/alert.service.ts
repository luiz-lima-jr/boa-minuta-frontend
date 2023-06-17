import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })
export class AlertService {

    constructor(private snackBar: MatSnackBar) {
        
    }

    success(message: string,  timeout: number = 4000) {
        this.snackBar.open(message, 'Fechar', {
            duration: timeout,
            panelClass: ['sucesso-alerta'],
            horizontalPosition: 'right'
        });
    }

    error(message: string, timeout: number = 3000) {
        this.snackBar.open(message, 'Fechar', {
            duration: timeout,
            panelClass: ['erro-alerta'],
            horizontalPosition: 'right'
        });
    }

    warning(message: string, timeout: number = 3000) {
        this.snackBar.open(message, 'Fechar', {
            duration: timeout,
            panelClass: ['warning-alerta'],
            horizontalPosition: 'right'
        });
    }
}