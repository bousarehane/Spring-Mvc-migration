import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAvailableTerminalsComponent } from './list-available-terminals.component';

describe('ListAvailableTerminalsComponent', () => {
  let component: ListAvailableTerminalsComponent;
  let fixture: ComponentFixture<ListAvailableTerminalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAvailableTerminalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAvailableTerminalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
