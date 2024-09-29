import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(input: any, propertyName?: string, separator = ', '): any {
    if (Array.isArray(input)) {
      const transformedList = propertyName
        ? input.map((item) => item[propertyName])
        : [...input];
      return transformedList.join(separator);
    }

    return '';
  }
}
