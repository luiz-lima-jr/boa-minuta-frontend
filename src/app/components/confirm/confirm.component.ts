import { Component, OnInit, OnDestroy } from '@angular/core';

import {MatDialog } from '@angular/material/dialog';
import { ConfirmService } from 'src/app/services/confirm.service';
import { ConfirmDialogComponent, OptionsModalConfirmar } from './confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-confirm',
    templateUrl: 'confirm.component.html',
    styleUrls: ['./confirm.component.css']
})

export class ConfirmComponent implements OnInit, OnDestroy {
    options: OptionsModalConfirmar;

    constructor(private confirmService: ConfirmService, public dialog: MatDialog) { }

    ngOnInit() {
        this.confirmService.getMessage().subscribe(options => { 
            this.options = options; 
            this.openDialog();
        });
    }

    openDialog() {
        if(this.options.mensagem !== undefined){
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: this.options});
            dialogRef.afterClosed().subscribe(acao => acao.subscribe());
        }
    }

    ngOnDestroy() {
    }
}