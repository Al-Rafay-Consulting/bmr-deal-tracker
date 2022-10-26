import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorizationlistComponent } from './categorizationlist.component';

describe('CategorizationlistComponent', () => {
  let component: CategorizationlistComponent;
  let fixture: ComponentFixture<CategorizationlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorizationlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorizationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
