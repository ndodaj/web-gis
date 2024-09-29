import { Injectable, Injector } from '@angular/core';
import {
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategyOrigin,
  Overlay,
  OverlayConfig,
  PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PopoverRef } from '@shared/components/popover/popover-ref';
import { PopoverComponent } from '@shared/components/popover/popover.component';
import { PopoverParams } from '@core/models/popover-params';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T>({
    origin,
    content,
    data,
    width,
    height,
    positions,
    offsetX,
    offsetY
  }: PopoverParams<T>): PopoverRef<T> {
    const overlayRef = this.overlay.create(
      this.getOverlayConfig(origin, width, height, positions, offsetX, offsetY)
    );
    const popoverRef = new PopoverRef<T>(overlayRef, content, data);

    const injector = this.createInjector(popoverRef, this.injector);
    overlayRef.attach(new ComponentPortal(PopoverComponent, null, injector));

    return popoverRef;
  }

  private static getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom'
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top'
      }
    ];
  }

  private getOverlayConfig(
    origin: FlexibleConnectedPositionStrategyOrigin,
    width?: string | number,
    height?: string | number,
    positions?: ConnectedPosition[],
    offsetX?: number,
    offsetY?: number
  ): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      width,
      height,
      backdropClass: 'popover-backdrop',
      positionStrategy: this.getOverlayPosition(
        origin,
        positions,
        offsetX,
        offsetY
      ),
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  createInjector(popoverRef: PopoverRef, injector: Injector) {
    return Injector.create({
      providers: [
        {
          provide: PopoverRef,
          useValue: popoverRef
        }
      ],
      parent: injector
    });
  }

  private getOverlayPosition(
    origin: FlexibleConnectedPositionStrategyOrigin,
    positions?: ConnectedPosition[],
    offsetX?: number,
    offsetY?: number
  ): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(positions || PopoverService.getPositions())
      .withFlexibleDimensions(true)
      .withDefaultOffsetY(offsetY || 0)
      .withDefaultOffsetX(offsetX || 0)
      .withTransformOriginOn('.app-popover')
      .withPush(true);
  }
}
