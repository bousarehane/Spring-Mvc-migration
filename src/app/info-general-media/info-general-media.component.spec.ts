import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGeneralMediaComponent } from './info-general-media.component';

describe('InfoGeneralMediaComponent', () => {
  let component: InfoGeneralMediaComponent;
  let fixture: ComponentFixture<InfoGeneralMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGeneralMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGeneralMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
