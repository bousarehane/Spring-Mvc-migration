import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignTerminalsComponent } from './list-assign-terminals.component';

describe('ListAssignTerminalsComponent', () => {
  let component: ListAssignTerminalsComponent;
  let fixture: ComponentFixture<ListAssignTerminalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAssignTerminalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssignTerminalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
