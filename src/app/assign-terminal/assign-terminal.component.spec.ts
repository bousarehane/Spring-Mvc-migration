import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTerminalComponent } from './assign-terminal.component';

describe('AssignTerminalComponent', () => {
  let component: AssignTerminalComponent;
  let fixture: ComponentFixture<AssignTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
