import {Directive, ElementRef, forwardRef, HostListener, Input} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import {NG_VALUE_ACCESSOR} from '@angular/forms'

@Directive({
  selector: 'input[appMobileMask]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MobileMaskDirective},
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MobileMaskDirective),
      multi: true,
    }
  ]
})
export class MobileMaskDirective {

  private _value: string | null;

  constructor(private elementRef: ElementRef<HTMLInputElement>,
  ) {

  }
  get value(): string | null {
    return this._value;
  }
 
  @Input('value')
  set value(value: string | null) {
    this._value = value;
    // this.formatValue(value);
    this.onInputChange(value,false);
  }
 
  // private formatValue(value: string | null) {
  //   if (value !== null) {
  //     this.elementRef.nativeElement.value = formatNumber(Number(value), 'en-US', '1.0-0')//numberWithCommas(value);
  //   } else {
  //     this.elementRef.nativeElement.value = '';
  //   }
  // }
 
  // private unFormatValue() {
  //   const value = this.elementRef.nativeElement.value;
  //   this._value = value.replace(/[^\d.-]/g, '');
  //   if (value) {
  //     this.elementRef.nativeElement.value = this._value;
  //   } else {
  //     this.elementRef.nativeElement.value = '';
  //   }
  // }
 
  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this._value = value.replace(/[^\d.-]/g, '');
    this._onChange(this._value); // here to notify Angular Validators
  }
 
  @HostListener('blur')
  _onBlur() {
    // this.formatValue(this._value);
    this.onInputChange(this._value,false);

  }
 
  @HostListener('focus')
  onFocus() {
    // this.unFormatValue();
  }

  
  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, false);
  }
 
  _onChange(value: any): void {
  }
 
  writeValue(value: any) {
    this._value = value;
    // this.formatValue(this._value); // format Value
    this.onInputChange(this._value,false);

  }
 
  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }
 
  registerOnTouched() {
  }

  onInputChange(event: string | null, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    // this.ngControl.valueAccessor.writeValue(newVal);
    this.elementRef.nativeElement.value=newVal;
  }
 

}
