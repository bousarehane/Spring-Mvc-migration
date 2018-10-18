import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueCampComponent } from './historique-camp.component';

describe('HistoriqueCampComponent', () => {
  let component: HistoriqueCampComponent;
  let fixture: ComponentFixture<HistoriqueCampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriqueCampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
