import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timespanFormatter'
})
export class TimespanFormatterPipe implements PipeTransform {
  transform(value: string): string {
    return value
      ? moment.utc(moment.duration(value).asMilliseconds()).format('kk:mm')
      : '';
  }
}
