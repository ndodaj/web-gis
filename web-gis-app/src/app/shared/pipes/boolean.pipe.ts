import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanPipe'
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean | undefined): string {
    return value === true ? 'YES' : 'NO';
  }
}
