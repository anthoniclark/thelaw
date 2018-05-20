import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberpad'
})
export class NumberpadPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let out = '';
    value = value || '';
    let limit = args ? parseInt(args, 10) : 2;
    var inputLength = value.toString().length;

    for (var i = 0; i < (limit - inputLength); i++) {
      out = '0' + out;
    }
    out = out + value;
    return out;
  }

}
