import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OverlayPanelService {
  private showOverlayPanelSubject = new Subject<boolean>();

  showOverlayPanel() {
    this.showOverlayPanelSubject.next(true);
  }

  hideOverlayPanel() {
    this.showOverlayPanelSubject.next(false);
  }

  getOverlayPanelVisibility() {
    return this.showOverlayPanelSubject.asObservable();
  }
}
