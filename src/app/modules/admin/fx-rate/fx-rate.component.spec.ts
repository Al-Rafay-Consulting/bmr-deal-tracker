import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FXRateComponent } from './fx-rate.component';

describe('FXRateComponent', () => {
  let component: FXRateComponent;
  let fixture: ComponentFixture<FXRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FXRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FXRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
