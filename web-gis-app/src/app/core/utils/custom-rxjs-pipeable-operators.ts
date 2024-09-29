import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AutoUnsubscribe as _AutoUnsubscribe } from './decorators';

export type AutoUnsubscribeClassExtendedTypeChecking = {
  autoUnsubscribeDecoratorAttached?: boolean;
  onDestroy$?: Subject<void>;
  ngOnDestroy?: () => void;
};

function createOnDestroySubjectAndReturnIt<T>(
  classInstance: T & AutoUnsubscribeClassExtendedTypeChecking
): Subject<void> {
  if (!classInstance.onDestroy$) {
    classInstance.onDestroy$ = new Subject<void>();
  }
  return classInstance.onDestroy$;
}

/**
 * @description
 * Custom pipeable operator, which handles unsubscribing from the Observable automatically.
 *
 * _Should be used in pair with the custom_ {@link _AutoUnsubscribe AutoUnsubscribe} _class decorator (see example below)_
 *
 * @param classInstance
 * @returns Modified Observable to pipe the `takeUntil` operator, containing the component's `ngOnDestroy$` notifier, which was created from the `AutoUnsubscribe` custom decorator
 *
 * @example
 * *@Component*({ // (without the asterisks)
 *   selector: 'app-app',
 *   templateUrl: './app.component.html',
 *   styleUrls: ['./app.component.scss']
 * })
 * *@AutoUnsubscribe* // (without the asterisks)
 * export class AppComponent implements OnInit {
 *   counter = 1;
 *
 *   constructor() { }
 *
 *   ngOnInit(): void {
 *     interval(1000).pipe(unsubscribeOnDestroy(this)).subscribe(console.log);
 *   }
 * }
 */
export function unsubscribeOnDestroy<T>(
  classInstance: T & AutoUnsubscribeClassExtendedTypeChecking
) {
  return <U>(source: Observable<U>) => {
    if (!classInstance.autoUnsubscribeDecoratorAttached) {
      throw new Error(
        `The class (${classInstance.constructor.name}), where the custom "unsubscrieOnDestroy" pipeable operator is being used, is not decorated with "AutoUnsubscribe" decorator`
      );
    }
    return source.pipe(
      takeUntil<U>(
        createOnDestroySubjectAndReturnIt(classInstance.constructor.prototype)
      )
    );
  };
}
