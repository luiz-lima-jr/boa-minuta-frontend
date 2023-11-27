import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: 'confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
  })
  export class ConfirmDialogComponent {

    constructor(
      public dialogRef: MatDialogRef<ConfirmDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: OptionsModalConfirmar,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  export class OptionsModalConfirmar {
    mensagem?: string;
    acao?: Observable<any>;
  }

  export enum TipoAlerta {
    SUCESS, ALERT, ERROR
  }