import { PhoneMaskDirective } from './phone-mask.directive';
import { NgControl } from '@angular/forms';

describe('PhoneMaskDirective', () => {
  it('should create an instance', () => {
    const directive = new PhoneMaskDirective();
    expect(directive).toBeTruthy();
  });
});
