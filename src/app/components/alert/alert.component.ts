import { Component, OnInit, OnDestroy } from '@angular/core';

import {MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AlertDialogComponent, OptionsModal } from './alert-modal/alert-modal.component';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
    options: OptionsModal;

    constructor(private alertService: AlertService, public dialog: MatDialog) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(options => { 
            this.options = options; 
            this.openDialog();
        });
    }

    openDialog() {
        if(this.options.tipo !== undefined){
            const dialogRef = this.dialog.open(AlertDialogComponent, {data: this.options});
            dialogRef.afterClosed().subscribe(result => {});

            if(this.options.timeout){
                setTimeout(() => {
                    dialogRef.close();
                }, this.options.timeout)
            }
        }
    }

    ngOnDestroy() {
    }
}