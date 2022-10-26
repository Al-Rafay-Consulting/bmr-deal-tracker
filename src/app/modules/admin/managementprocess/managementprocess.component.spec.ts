import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementprocessComponent } from './managementprocess.component';

describe('ManagementprocessComponent', () => {
  let component: ManagementprocessComponent;
  let fixture: ComponentFixture<ManagementprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
