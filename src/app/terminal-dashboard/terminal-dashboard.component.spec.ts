import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalDashboardComponent } from './terminal-dashboard.component';

describe('TerminalDashboardComponent', () => {
  let component: TerminalDashboardComponent;
  let fixture: ComponentFixture<TerminalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
