import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    /*transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.title.indexOf(filter.title) !== -1);
    }*/

    transform(items: any[], field : string, value : any): any[] {  
        if (!items) return [];
        if (!value || value.length == 0) return items;
        return items.filter(it => 
        // it[field].toString().toLowerCase().indexOf(value.toLowerCase()) !=-1
        it[field].toString().toLowerCase() == value.toString().toLowerCase())
        ;
        //);
      }
}