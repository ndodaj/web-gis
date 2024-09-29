import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { TemplateRef, Type } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PopoverCloseEvent<T = any> {
  type: 'backdropClick' | 'close';
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PopoverContent = TemplateRef<any> | Type<any> | string | any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PopoverRef<T = any> {
  private afterClosed = new Subject<PopoverCloseEvent<T | undefined>>();
  afterClosed$ = this.afterClosed.asObservable();

  constructor(
    public overlay: OverlayRef,
    public content: PopoverContent,
    public data: T | undefined
  ) {
    overlay.backdropClick().subscribe(() => {
      this._close('backdropClick', undefined);
    });
  }

  close(data?: T) {
    this._close('close', data);
  }

  private _close(type: PopoverCloseEvent['type'], data?: T) {
    this.overlay.dispose();
    this.afterClosed.next({
      type,
      data
    });
    this.afterClosed.complete();
  }
}
