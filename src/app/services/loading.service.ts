import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class LoadingService {
    private estado = new Subject<boolean>();
    private isBlockShow = false;
  
    constructor() {}
  
    blockShow(){
      this.isBlockShow = true;
    }
    
    unblockShow(){
      debugger
      this.isBlockShow = false;
    }

    show() {
      this.estado.next(true && !this.isBlockShow);
    }
  
    hide() {
      this.estado.next(false);
    }
  
    getEstado(): Observable<boolean> {
      return this.estado.asObservable();
    }
  }
  