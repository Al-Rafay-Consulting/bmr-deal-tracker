import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementprocesslistComponent } from './managementprocesslist.component';

describe('ManagementprocesslistComponent', () => {
  let component: ManagementprocesslistComponent;
  let fixture: ComponentFixture<ManagementprocesslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementprocesslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementprocesslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
