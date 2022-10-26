import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatNumber, formatCurrency } from '@angular/common';


@Directive({
  selector: 'input[appMatInputCurrency]',
  providers: [
    { provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputCurrencyDirective },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputCurrencyDirective),
      multi: true,
    }
  ]
})
export class MatInputCurrencyDirective {


  // tslint:disable-next-line:variable-name
  private _value: string | null;
  @Input() currencydecimal: string;

  constructor(private elementRef: ElementRef<HTMLInputElement>,
  ) {
    //elementRef.nativeElement.style.textAlign = 'right'; 
    /// console.log('created directive');
  }


  get value(): string | null {
    return this._value;
  }

  @Input('value')
  set value(value: string | null) {
    this._value = value == "" ? null : value;
    this.formatValue(value);
  }

  private formatValue(value: string | null) {

    if (value !== null && value !== "") {
      if (this.currencydecimal == "" || this.currencydecimal == undefined) {
        // this.elementRef.nativeElement.value = formatCurrency(Number(value), 'en-US', '','','')//numberWithCommas(value);
        this.elementRef.nativeElement.value = formatCurrency(Number(value), 'en-US', '','','1.0')
        console.log(value)   
      }
      else if (this.currencydecimal != "")
        this.elementRef.nativeElement.value = formatCurrency(Number(value), 'en-US', '','','1.0')//numberWithCommas(value);      
    } else {
      this.elementRef.nativeElement.value = null;
    }
  }

  private unFormatValue() {
    const value = this.elementRef.nativeElement.value;
    this._value = value == "" ? null : value.replace(/[^\d.-]/g, '');

    if (value) {
      this.elementRef.nativeElement.value = this._value;
    } else {
      this.elementRef.nativeElement.value = null;
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this._value = value == "" ? null : value.replace(/[^\d.-]/g, '');

    this._onChange(this._value); // here to notify Angular Validators
  }

  @HostListener('blur')
  _onBlur() {
    this.formatValue(this._value);
  }

  @HostListener('focus')
  onFocus() {
    this.unFormatValue();
  }

  _onChange(value: any): void {
  }

  writeValue(value: any) {
    this._value = value == "" ? null : value;;
    this.formatValue(this._value); // format Value
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched() {
  }

}
