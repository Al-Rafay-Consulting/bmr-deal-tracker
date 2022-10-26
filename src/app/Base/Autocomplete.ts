import { Observable, Subject } from 'rxjs';
import { startWith, map, take, takeUntil } from 'rxjs/operators';

export class Autocomplete<T>{
  public searchResult = new Subject();
  public results: Observable<T[]>
  public data: T[];
  public selectedValue:any;

  
  protected _onDestroy = new Subject<void>();
  
  constructor(public displayValueName: string, public filterIDName: string) {
    this.searchResult = new Subject();
    this.results = new Observable<T[]>();
  }

  public filter(value: string, fieldName: string): T[] | undefined {
    const filterValue = value.toLowerCase();
    return this.data.filter(option => option[fieldName].toLowerCase().indexOf(filterValue) === 0);
  }

  public onDisplayValue = (ID: number): string | undefined => {
    return ID? this.data.filter(x => x[this.filterIDName] === ID)[0][this.displayValueName] : undefined
  }

  public resultObserve() {
    this.results = this.searchResult.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value[this.displayValueName]
    ),
      map(name => name ? this.filter(name, this.displayValueName) : this.data.slice())
    );
  }

  public toggleSelectAll(selectAllValue: boolean, autoComplete:Autocomplete<T>, filterName:string) {

    if (selectAllValue == false) {
      return [];
    }
    else if (selectAllValue){
      autoComplete.results.pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(val => {
          var vals = val.map(a => a[filterName]);
          return vals;
        })
    }
  }

  

}