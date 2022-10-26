import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]'
})
export class InputRestrictionDirective {

  @Input('inputrestriction') InputRestriction : string;

  private element : ElementRef;

  constructor(element : ElementRef) {
    this.element = element;
  }

  @HostListener('keypress', ['$event'])
  handleKeyPress(event : KeyboardEvent)
  {
    var regex = new RegExp(this.InputRestriction);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }

}
