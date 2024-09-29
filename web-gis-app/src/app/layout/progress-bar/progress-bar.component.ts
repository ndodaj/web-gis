import { Component } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable, interval, of } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  value$: Observable<number> = this.loader.value$.pipe(
    delayWhen((value) => (value === 0 ? interval(200) : of(undefined)))
  );

  constructor(public loader: LoadingBarService) {}
}
