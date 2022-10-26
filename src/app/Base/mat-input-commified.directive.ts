import {Directive, ElementRef, forwardRef, HostListener, Input} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material/input';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {formatNumber} from '@angular/common';

@Directive({
  selector: 'input[matInputCommified]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputCommifiedDirective},
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputCommifiedDirective),
      multi: true,
    }
  ]
})

export class MatInputCommifiedDirective {

 // tslint:disable-next-line:variable-name
 private _value: string | null;

 constructor(private elementRef: ElementRef<HTMLInputElement>,
 ) {
   //elementRef.nativeElement.style.textAlign = 'right'; 
   //console.log('created directive');
 }


 get value(): string | null {
   return this._value;
 }

 @Input('value')
 set value(value: string | null) {
   this._value = value;
   this.formatValue(value);
 }

 private formatValue(value: string | null) {
   if (value !== null) {
     this.elementRef.nativeElement.value = formatNumber(Number(value), 'en-US', '1.0-0')//numberWithCommas(value);
   } else {
     this.elementRef.nativeElement.value = '';
   }
 }

 private unFormatValue() {
   const value = this.elementRef.nativeElement.value;
   this._value = value.replace(/[^\d.-]/g, '');
   if (value) {
     this.elementRef.nativeElement.value = this._value;
   } else {
     this.elementRef.nativeElement.value = '';
   }
 }

 @HostListener('input', ['$event.target.value'])
 onInput(value) {
   this._value = value.replace(/[^\d.-]/g, '');
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
   this._value = value;
   this.formatValue(this._value); // format Value
 }

 registerOnChange(fn: (value: any) => void) {
   this._onChange = fn;
 }

 registerOnTouched() {
 }

}
