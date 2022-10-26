import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgModel} from '@angular/forms';

declare var google:any;

@Directive({
  selector: '[appGooglePlace]',
  providers: [NgModel],
  host: {
    '(input)' : 'onInputChange()'
  }
})
export class GooglePlaceDirective {
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  modelValue:any;
  autocomplete:any;
  private _el:HTMLElement;
  constructor(el: ElementRef,private model:NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    var input = this._el;
    this.autocomplete = new google.maps.places.Autocomplete(input, {
      // componentRestrictions: { country: ["us"] },
      fields: ["address_components", "geometry", "geometry/location"],
      types: ["address"]
    });
    google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
      var place = this.autocomplete.getPlace();
      // console.log(place);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      this.invokeEvent(place);
    });
  }

  invokeEvent(place:Object) {
    this.setAddress.emit(place);
  }
  onInputChange() {
    console.log(this.model);
  }

}
