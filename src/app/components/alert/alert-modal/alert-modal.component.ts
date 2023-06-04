import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'alert-dialog',
    templateUrl: 'alert-modal.component.html',
    styleUrls: ['./alert-modal.component.css']
  })
  export class AlertDialogComponent {

    SUCESS = TipoAlerta.SUCESS;
    ERROR = TipoAlerta.ERROR;

    constructor(
      public dialogRef: MatDialogRef<AlertDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: OptionsModal,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  export class OptionsModal {
    tipo?: TipoAlerta;
    mensagem?: string;
    timeout?: number;
  }

  export enum TipoAlerta {
    SUCESS, ALERT, ERROR
  }