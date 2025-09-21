import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private loginDrawerState = new BehaviorSubject<boolean>(false);
  loginDrawerState$ = this.loginDrawerState.asObservable();

  openLoginDrawer() {
    this.loginDrawerState.next(true);
  }

  closeLoginDrawe() {
    this.loginDrawerState.next(false);
  }
}
