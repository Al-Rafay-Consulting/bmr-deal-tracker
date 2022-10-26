import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  constructor(private el :ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event){
    const  intialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = intialValue.replace(/[^0-9]*/g,'');
    if(intialValue !== this.el.nativeElement.value)
        event.stopPropagation();
  }

}
