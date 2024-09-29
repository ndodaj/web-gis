import {
  AutoUnsubscribeClassExtendedTypeChecking,
  unsubscribeOnDestroy as _unsubscribeOnDestroy,
} from './custom-rxjs-pipeable-operators';

/**
 * @description
 * Custom class decorator, which handles creation of `onDestroy$` subject/notifier and implementation of `ngOnDestroy`, automatically.
 *
 * _Should be used in pair with the custom_ {@link _unsubscribeOnDestroy unsubscribeOnDestroy} _pipeable operator_
 *
 * @param constructor
 *
 * @example
 * *@Component*({ // (without the asterisks)
 *   selector: 'app-app',
 *   templateUrl: './app.component.html',
 *   styleUrls: ['./app.component.scss']
 * })
 * *@AutoUnsubscribe* // (without the asterisks)
 * export class AppComponent implements OnInit {
 */
export function AutoUnsubscribe<
  T extends {
    new (...args: any[]): {}; // eslint-disable-line
  } & AutoUnsubscribeClassExtendedTypeChecking
>(constructor: T): void {
  const self: {
    [key: string]: any;
  } & AutoUnsubscribeClassExtendedTypeChecking = constructor.prototype;
  const originalNgOnDestroy: (() => void) | undefined = self.ngOnDestroy;
  self.ngOnDestroy = (): void => {
    originalNgOnDestroy?.call(self);
    self.onDestroy$?.next();
    self.onDestroy$?.complete();
    self.onDestroy$ = undefined;
  };
  self.autoUnsubscribeDecoratorAttached = true;
}
