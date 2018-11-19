import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricMediaComponent } from './historic-media.component';

describe('HistoricMediaComponent', () => {
  let component: HistoricMediaComponent;
  let fixture: ComponentFixture<HistoricMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
