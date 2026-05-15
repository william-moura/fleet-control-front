import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.map((item: any) => item.name).join(', ');
  }
}
  