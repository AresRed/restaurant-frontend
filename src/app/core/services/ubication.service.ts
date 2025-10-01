import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {



  private dialogState = new Subject<boolean>();
  dialogState$ = this.dialogState.asObservable();

  open() {
    this.dialogState.next(true);
  }

  close() {
    this.dialogState.next(false);
  }
  constructor() { }


  
}
